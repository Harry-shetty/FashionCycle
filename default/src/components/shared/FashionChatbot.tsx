import { useState, useRef, useEffect, useMemo, type FormEvent, type ChangeEvent, type DragEvent, type ClipboardEvent } from "react";
import { queryGemini } from "../../services/gemini";
import { findFaqMatch, CHATBOT_FAQS } from "../../data/chatbotFaq";
import { apiRequest } from "../../services/api";
import { useAuth } from "../../hooks/useAuth";

interface AttachedImage {
  id: string;
  name: string;
  type: string;
  sizeFormatted: string;
  url: string;
}

export interface CircularActionBreakdown {
  action: "To Sell" | "To Repair" | "To Donate" | "To Recycle";
  percentage: number;
  icon: string;
  color: string;
  description: string;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  images?: AttachedImage[];
  timestamp: string;
  details?: {
    estimatedValue?: string;
    co2Saved?: string;
    waterSaved?: string;
    styleTags?: string[];
    topAction?: {
      action: string;
      percentage: number;
      icon: string;
      reason: string;
    };
    actionBreakdown?: CircularActionBreakdown[];
    suggestedPrompts?: string[];
  };
}

function getFieldIcon(label: string): string {
  const l = label.toLowerCase();
  if (l.includes("item") || l.includes("garment") || l.includes("piece") || l.includes("shirt") || l.includes("dress")) return "👕";
  if (l.includes("fabric") || l.includes("feel") || l.includes("material") || l.includes("textile") || l.includes("texture")) return "🧵";
  if (l.includes("condition") || l.includes("evaluation") || l.includes("grade") || l.includes("quality") || l.includes("wear")) return "🔍";
  if (l.includes("recommend") || l.includes("action") || l.includes("verdict") || l.includes("advice") || l.includes("next step")) return "💡";
  if (l.includes("care") || l.includes("wash") || l.includes("clean") || l.includes("maintain") || l.includes("iron") || l.includes("steam")) return "🧼";
  if (l.includes("style") || l.includes("vibe") || l.includes("outfit") || l.includes("aesthetic") || l.includes("look")) return "✨";
  if (l.includes("price") || l.includes("value") || l.includes("resale") || l.includes("worth") || l.includes("estimate")) return "🏷️";
  if (l.includes("eco") || l.includes("impact") || l.includes("sustain") || l.includes("planet") || l.includes("water") || l.includes("co2")) return "🌱";
  return "✦";
}

function renderFormattedInlineText(text: string, isUser: boolean = false) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return (
            <strong key={i} style={{ color: isUser ? "var(--fg)" : "var(--accent)", fontWeight: 700 }}>
              {p.slice(2, -2)}
            </strong>
          );
        }
        return p;
      })}
    </>
  );
}

function FormattedBotMessage({ text, sender }: { text: string; sender: "user" | "bot" }) {
  if (sender === "user") {
    return (
      <div style={{ whiteSpace: "pre-wrap" }}>
        {renderFormattedInlineText(text, true)}
      </div>
    );
  }

  // Parse lines for bot output
  const lines = text.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let idx = 0;
  while (idx < lines.length) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    if (!trimmed) {
      idx++;
      continue;
    }

    // 1. Heading check: starts with ### or ## or #
    if (/^#{1,6}\s*/.test(trimmed)) {
      const headingText = trimmed.replace(/^#{1,6}\s*/, "").replace(/[\*#_]/g, "").trim();
      renderedElements.push(
        <div
          key={`heading-${idx}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            background: "rgba(138,223,122,0.12)",
            border: "1px solid rgba(138,223,122,0.3)",
            borderRadius: "100px",
            padding: "5px 13px",
            fontSize: "0.78rem",
            fontWeight: 700,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.04em",
            color: "var(--accent)",
            marginTop: renderedElements.length > 0 ? "8px" : "2px",
            marginBottom: "6px",
            animation: "cardPop 0.35s ease-out",
          }}
        >
          <span>✨</span>
          <span>{headingText}</span>
        </div>
      );
      idx++;
      continue;
    }

    // 2. Structured attribute check: "* Item: ...", "* **Item:** ...", or "Item: ..."
    const strippedBullet = trimmed.replace(/^[\*\-•]\s*/, "");
    const attrMatch = strippedBullet.match(/^(?:\*\*)?([A-Za-z0-9&/ '’–—]+?)(?:\*\*)?:\s*(.+)$/);
    if (attrMatch) {
      const label = attrMatch[1].replace(/[\*#_]/g, "").trim();
      const value = attrMatch[2].trim();
      const isRecommend = /recommend/i.test(label);
      const icon = getFieldIcon(label);

      renderedElements.push(
        <div
          key={`attr-${idx}`}
          style={{
            background: isRecommend ? "rgba(138,223,122,0.08)" : "rgba(255,255,255,0.03)",
            border: isRecommend ? "1px solid rgba(138,223,122,0.35)" : "1px solid rgba(255,255,255,0.07)",
            borderRadius: "12px",
            padding: "10px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginTop: "4px",
            marginBottom: "4px",
            animation: `cardPop 0.4s ease-out ${renderedElements.length * 0.05}s both`,
            transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
            boxShadow: isRecommend ? "0 4px 16px rgba(138,223,122,0.08)" : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
            e.currentTarget.style.borderColor = isRecommend ? "var(--accent)" : "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.borderColor = isRecommend ? "rgba(138,223,122,0.35)" : "rgba(255,255,255,0.07)";
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "1rem" }}>{icon}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  color: isRecommend ? "var(--accent)" : "var(--muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {label}
              </span>
            </div>
            {isRecommend && (
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  background: "var(--accent)",
                  color: "#0a0a08",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  letterSpacing: "0.05em",
                }}
              >
                RECOMMENDED
              </span>
            )}
          </div>
          <div style={{ fontSize: "0.86rem", color: "var(--fg)", lineHeight: 1.5, paddingLeft: "2px" }}>
            {renderFormattedInlineText(value)}
          </div>
        </div>
      );
      idx++;
      continue;
    }

    // 3. Bullet check without colon: "* Some bullet point" or "- Some bullet point"
    const bulletMatch = trimmed.match(/^(?:[\*\-•]\s+)(.+)$/);
    if (bulletMatch) {
      const content = bulletMatch[1].trim();
      renderedElements.push(
        <div
          key={`bullet-${idx}`}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            fontSize: "0.86rem",
            lineHeight: 1.5,
            marginTop: "3px",
            marginBottom: "3px",
            animation: `cardPop 0.35s ease-out ${renderedElements.length * 0.04}s both`,
          }}
        >
          <span style={{ color: "var(--accent)", fontSize: "0.8rem", marginTop: "2px", flexShrink: 0 }}>◆</span>
          <span style={{ flex: 1, color: "var(--fg)" }}>{renderFormattedInlineText(content)}</span>
        </div>
      );
      idx++;
      continue;
    }

    // 4. Regular paragraph text (strip any accidental leading symbols)
    const cleanParagraph = trimmed.replace(/^#{1,6}\s*/, "").replace(/^[\*\-•]\s*/, "");
    renderedElements.push(
      <div
        key={`para-${idx}`}
        style={{
          fontSize: "0.88rem",
          lineHeight: 1.5,
          marginTop: "3px",
          marginBottom: "5px",
          color: "var(--fg)",
        }}
      >
        {renderFormattedInlineText(cleanParagraph)}
      </div>
    );
    idx++;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px", width: "100%" }}>
      {renderedElements}
    </div>
  );
}

const WELCOME_MESSAGE: Message = {
  id: "welcome-1",
  sender: "bot",
  text: "👋 Hi there! I'm **CycleBot**, your AI Circular Fashion & Styling assistant for FashionCycle.\n\nUpload **any image format** (clothing photos, care labels, outfit inspiration) and I'll inspect the fabric and calculate the **exact circular action probability**:\n• **To Sell** 🏷️ (Resale earnings)\n• **To Repair** 🪡 (Restoration potential)\n• **To Donate** 🎁 (Community impact)\n• **To Recycle** ♻️ (Textile recovery)\n\nDrop a photo or ask me anything to get started!",
  timestamp: "Just now",
  details: {
    suggestedPrompts: [
      "📸 Value an item from a photo",
      "🌱 How does circular fashion save water?",
      "🏷️ Best tips to sell faster",
    ],
  },
};

export default function FashionChatbot() {
  const { user, isAuthenticated } = useAuth();
  const currentUserId = user?.email || "default-user";

  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [input, setInput] = useState("");
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null);
  const [isMongoSynced, setIsMongoSynced] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [historyFilter, setHistoryFilter] = useState<"all" | "appraisals" | "user">("all");
  const [historySearch, setHistorySearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active chat session messages — opens with fresh New Chat by default
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  // Historical messages loaded from MongoDB/local cache
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);

  const handleStartNewChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setAttachedImages([]);
    setActiveTab("chat");
  };

  // Global listener to open chatbot or directly open into history view from anywhere
  useEffect(() => {
    const handleOpenBot = (e: any) => {
      setIsOpen(true);
      setHasInteracted(true);
      if (e?.detail?.tab === "history") {
        setActiveTab("history");
      } else {
        handleStartNewChat();
      }
    };
    window.addEventListener("open-cyclebot", handleOpenBot);
    return () => window.removeEventListener("open-cyclebot", handleOpenBot);
  }, []);

  // Load chat history from MongoDB on mount/user change into historyMessages
  useEffect(() => {
    let isMounted = true;
    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        const history = await apiRequest<Message[]>(
          `/chatbot/history?userId=${encodeURIComponent(currentUserId)}`
        );
        if (isMounted && Array.isArray(history) && history.length > 0) {
          setHistoryMessages(history);
          setIsMongoSynced(true);
        } else {
          // Fallback to localStorage
          const local = localStorage.getItem(`fc_chat_${currentUserId}`);
          if (local && isMounted) {
            try {
              const parsed = JSON.parse(local);
              if (Array.isArray(parsed) && parsed.length > 0) {
                setHistoryMessages(parsed);
              }
            } catch {}
          }
        }
      } catch (err) {
        console.warn("MongoDB chatbot history fetch notice (local fallback):", err);
        const local = localStorage.getItem(`fc_chat_${currentUserId}`);
        if (local && isMounted) {
          try {
            const parsed = JSON.parse(local);
            if (Array.isArray(parsed) && parsed.length > 0) setHistoryMessages(parsed);
          } catch {}
        }
      } finally {
        if (isMounted) setIsLoadingHistory(false);
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, [currentUserId]);

  const saveMessageToMongoDB = async (msg: Message) => {
    // 1. Keep historyMessages in memory in sync immediately
    setHistoryMessages((prev) => [...prev, msg]);

    // 2. Save to local storage cache immediately
    try {
      const local = JSON.parse(localStorage.getItem(`fc_chat_${currentUserId}`) || "[]");
      localStorage.setItem(`fc_chat_${currentUserId}`, JSON.stringify([...local, msg]));
    } catch {}

    // 3. Persist to MongoDB
    try {
      await apiRequest("/chatbot/message", {
        method: "POST",
        body: JSON.stringify({ ...msg, userId: currentUserId }),
      });
      setIsMongoSynced(true);
    } catch (err) {
      console.warn("MongoDB chatbot message save notice:", err);
    }
  };

  const handleClearChat = async () => {
    const welcomeClear: Message = {
      id: `welcome-${Date.now()}`,
      sender: "bot",
      text: "Chat cleared! Upload any garment photo or ask a question to test CycleBot's circular fashion analysis.",
      timestamp: "Just now",
      details: {
        suggestedPrompts: [
          "📸 Value an item from a photo",
          "🌱 How do circular clothes help?",
          "🏷️ Best tips to sell faster",
        ],
      },
    };

    setMessages([welcomeClear]);
    setHistoryMessages([]);
    localStorage.removeItem(`fc_chat_${currentUserId}`);

    try {
      await apiRequest(`/chatbot/history?userId=${encodeURIComponent(currentUserId)}`, {
        method: "DELETE",
      });
    } catch (err) {
      console.warn("MongoDB chatbot history clear notice:", err);
    }
  };

  const conversationTurns = useMemo(() => {
    // Combine historyMessages with any unsaved user turns from current session
    const all = [...historyMessages];
    messages.forEach((m) => {
      if (!all.some((h) => h.id === m.id) && m.id !== "welcome-1") {
        all.push(m);
      }
    });

    const turns: { id: string; user: Message; bot?: Message }[] = [];
    for (let i = 0; i < all.length; i++) {
      if (all[i].sender === "user") {
        const userMsg = all[i];
        const nextMsg = all[i + 1]?.sender === "bot" ? all[i + 1] : undefined;
        turns.push({ id: userMsg.id, user: userMsg, bot: nextMsg });
      }
    }
    return turns.reverse();
  }, [historyMessages, messages]);

  const filteredTurns = useMemo(() => {
    return conversationTurns.filter((turn) => {
      if (historyFilter === "appraisals" && !turn.bot?.details?.topAction && (!turn.user.images || turn.user.images.length === 0)) {
        return false;
      }
      if (historyFilter === "user" && turn.user.images && turn.user.images.length > 0) {
        return false;
      }
      if (historySearch.trim()) {
        const q = historySearch.toLowerCase();
        const matchesUser = turn.user.text.toLowerCase().includes(q);
        const matchesBot = turn.bot?.text?.toLowerCase().includes(q) || false;
        const matchesAction = turn.bot?.details?.topAction?.action?.toLowerCase().includes(q) || false;
        if (!matchesUser && !matchesBot && !matchesAction) return false;
      }
      return true;
    });
  }, [conversationTurns, historyFilter, historySearch]);

  const jumpToMessage = (userMsgId: string, botMsgId?: string) => {
    // 1. Load full history so previous conversation is fully viewable
    setMessages(historyMessages);
    setActiveTab("chat");

    // 2. Scroll to the END of that previous conversation
    setTimeout(() => {
      const targetId = botMsgId || userMsgId;
      const el = document.getElementById(targetId);
      if (el) {
        // block: "end" ensures the bottom of the conversation is scrolled into view!
        el.scrollIntoView({ behavior: "smooth", block: "end" });
        el.style.transition = "box-shadow 0.4s ease";
        el.style.boxShadow = "0 0 24px rgba(138,223,122,0.45)";
        setTimeout(() => {
          el.style.boxShadow = "none";
        }, 1600);
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Process files (works for file input, drag & drop, and clipboard paste)
  const processFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validImageFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") || /\.(jpe?g|png|webp|gif|svg|bmp|tiff|avif|heic)$/i.test(file.name)
    );

    if (validImageFiles.length === 0) return;

    validImageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const sizeFormatted = file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${Math.round(file.size / 1024)} KB`;
        
        const extension = file.name.split('.').pop()?.toUpperCase() || file.type.split('/')[1]?.toUpperCase() || "IMG";

        setAttachedImages((prev) => [
          ...prev,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            type: extension,
            sizeFormatted,
            url,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      processFiles(e.clipboardData.files);
    }
  };

  const removeAttachedImage = (id: string) => {
    setAttachedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSend = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed && attachedImages.length === 0) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      images: attachedImages.length > 0 ? [...attachedImages] : undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const stagedImages = [...attachedImages];
    setMessages((prev) => [...prev, userMessage]);
    saveMessageToMongoDB(userMessage);
    setInput("");
    setAttachedImages([]);
    setIsTyping(true);

    // 1. Check predetermined mock FAQ data first (directly uses mock data instead of Gemini API)
    if (stagedImages.length === 0) {
      const faqMatch = findFaqMatch(trimmed);
      if (faqMatch) {
        setTimeout(() => {
          const botMessage: Message = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: faqMatch.text,
            details: {
              topAction: faqMatch.topAction,
              actionBreakdown: faqMatch.actionBreakdown,
              estimatedValue: faqMatch.estimatedValue,
              co2Saved: faqMatch.co2Saved,
              waterSaved: faqMatch.waterSaved,
              styleTags: faqMatch.styleTags,
              suggestedPrompts: faqMatch.suggestedPrompts,
            },
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };
          setMessages((prev) => [...prev, botMessage]);
          saveMessageToMongoDB(botMessage);
          setIsTyping(false);
        }, 350);
        return;
      }
    }

    try {
      const geminiImages = stagedImages.map((img) => {
        const [header, base64] = img.url.split(",");
        const mimeType = header.match(/:(.*?);/)?.[1] || "image/jpeg";
        return { mimeType, base64 };
      });

      const response = await queryGemini(trimmed, geminiImages);

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        details: {
          topAction: response.topAction,
          actionBreakdown: response.actionBreakdown,
          estimatedValue: response.estimatedValue,
          co2Saved: response.co2Saved,
          waterSaved: response.waterSaved,
          styleTags: response.styleTags,
          suggestedPrompts: response.suggestedPrompts,
        },
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
      saveMessageToMongoDB(botMessage);
    } catch (err) {
      console.error("Gemini query error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const triggerStarterPrompt = (promptText: string) => {
    setInput(promptText);
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Button */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {!isOpen && !hasInteracted && (
          <div
            className="chatbot-cta-pill"
            onClick={() => {
              handleStartNewChat();
              setIsOpen(true);
              setHasInteracted(true);
            }}
            style={{
              marginBottom: "8px",
              background: "var(--card-bg)",
              border: "1px solid var(--accent)",
              padding: "6px 12px",
              borderRadius: "100px",
              fontSize: "0.75rem",
              fontFamily: "var(--font-mono)",
              color: "var(--accent)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              animation: "fadeIn 0.4s ease",
            }}
          >
            <span>✨ CycleBot: Sell, Repair, or Donate?</span>
            <span style={{ fontSize: "0.85rem" }}>→</span>
          </div>
        )}

        <button
          onClick={() => {
            if (!isOpen) {
              handleStartNewChat();
            }
            setIsOpen(!isOpen);
            setHasInteracted(true);
          }}
          aria-label="Open AI Fashion Chatbot"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: isOpen ? "var(--card-bg)" : "var(--accent)",
            color: isOpen ? "var(--fg)" : "#0a0a08",
            border: isOpen ? "1px solid var(--border)" : "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 16px rgba(138,223,122,0.3)",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg) scale(1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = isOpen ? "rotate(90deg) scale(1.05)" : "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = isOpen ? "rotate(90deg)" : "scale(1)";
          }}
        >
          {isOpen ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
          style={{
            position: "fixed",
            bottom: "92px",
            right: "24px",
            width: "440px",
            maxWidth: "calc(100vw - 32px)",
            height: "620px",
            maxHeight: "calc(100vh - 120px)",
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Drag Overlay Indicator */}
          {isDragging && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(10,10,8,0.92)",
                border: "2px dashed var(--accent)",
                borderRadius: "24px",
                zIndex: 100,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                pointerEvents: "none",
              }}
            >
              <div style={{ fontSize: "2.5rem" }}>📥</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--accent)" }}>
                Drop garment photo here!
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)" }}>
                Supports all formats: PNG, JPG, WEBP, GIF, SVG, AVIF, HEIC
              </div>
            </div>
          )}

          {/* Header */}
          <div
            style={{
              padding: "16px 20px",
              background: "#0e0e0b",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  background: "rgba(138,223,122,0.12)",
                  border: "1px solid rgba(138,223,122,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.1rem",
                  position: "relative",
                }}
              >
                ♻️
                <span
                  style={{
                    position: "absolute",
                    bottom: "-1px",
                    right: "-1px",
                    width: "10px",
                    height: "10px",
                    background: "var(--accent)",
                    borderRadius: "50%",
                    border: "2px solid #0e0e0b",
                  }}
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700, margin: 0, color: "var(--fg)" }}>
                    CycleBot
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                  Sell vs Repair vs Donate Advisor
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                onClick={handleClearChat}
                title="Clear Chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--muted)",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--fg)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>

          {/* View Mode Switcher: Chat vs MongoDB History */}
          <div
            style={{
              padding: "6px 14px",
              background: "#12120e",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "100px",
                  border: activeTab === "chat" ? "1px solid var(--accent)" : "1px solid transparent",
                  background: activeTab === "chat" ? "rgba(138,223,122,0.16)" : "transparent",
                  color: activeTab === "chat" ? "var(--accent)" : "var(--muted)",
                  fontSize: "0.76rem",
                  fontWeight: activeTab === "chat" ? 700 : 500,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s",
                }}
              >
                <span>💬 Chat</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                style={{
                  padding: "4px 12px",
                  borderRadius: "100px",
                  border: activeTab === "history" ? "1px solid var(--accent)" : "1px solid transparent",
                  background: activeTab === "history" ? "rgba(138,223,122,0.16)" : "transparent",
                  color: activeTab === "history" ? "var(--accent)" : "var(--muted)",
                  fontSize: "0.76rem",
                  fontWeight: activeTab === "history" ? 700 : 500,
                  fontFamily: "var(--font-body)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "all 0.2s",
                }}
              >
                <span>History</span>
                {conversationTurns.length > 0 && (
                  <span
                    style={{
                      background: "var(--accent)",
                      color: "#0a0a08",
                      fontSize: "0.62rem",
                      fontWeight: 800,
                      borderRadius: "100px",
                      padding: "1px 6px",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {conversationTurns.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={handleStartNewChat}
              title="Start a fresh new conversation"
              style={{
                padding: "3px 10px",
                borderRadius: "100px",
                border: "1px solid rgba(138,223,122,0.35)",
                background: "rgba(138,223,122,0.08)",
                color: "var(--accent)",
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: "var(--font-body)",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "#0a0a08";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(138,223,122,0.08)";
                e.currentTarget.style.color = "var(--accent)";
              }}
            >
              <span>＋ New Chat</span>
            </button>
          </div>

          {activeTab === "history" ? (
            /* ─── HISTORY EXPLORER VIEW ─── */
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                background: "var(--card-bg)",
              }}
            >
              {/* Search & Filter Controls */}
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  type="text"
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  placeholder="Search past analyses, questions, or brands..."
                  style={{
                    flex: 1,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "100px",
                    padding: "7px 14px",
                    color: "var(--fg)",
                    fontSize: "0.8rem",
                    outline: "none",
                  }}
                />
              </div>

              {/* Filter Pills */}
              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                {[
                  { id: "all" as const, label: `All Sessions (${conversationTurns.length})` },
                  { id: "appraisals" as const, label: "Garment Appraisals 🏷️" },
                  { id: "user" as const, label: "Questions 💬" },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setHistoryFilter(f.id)}
                    style={{
                      padding: "3px 10px",
                      borderRadius: "100px",
                      border: `1px solid ${historyFilter === f.id ? "var(--accent)" : "var(--border)"}`,
                      background: historyFilter === f.id ? "rgba(138,223,122,0.12)" : "transparent",
                      color: historyFilter === f.id ? "var(--accent)" : "var(--muted)",
                      fontSize: "0.72rem",
                      fontWeight: historyFilter === f.id ? 700 : 500,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* History Cards List */}
              {filteredTurns.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "3rem 1.5rem",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: "16px",
                    border: "1px dashed var(--border)",
                    marginTop: "0.5rem",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📜</div>
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--fg)", margin: "0 0 6px" }}>
                    {historySearch ? "No matching history found" : "No past sessions yet"}
                  </h4>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--muted)", margin: "0 0 16px", maxWidth: 280, marginInline: "auto" }}>
                    Ask CycleBot a circular styling question or upload garment photos. Every session is automatically stored in MongoDB!
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("chat")}
                    style={{
                      background: "var(--accent)",
                      color: "#0a0a08",
                      border: "none",
                      borderRadius: "100px",
                      padding: "6px 16px",
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Start First Conversation →
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {filteredTurns.map((turn, idx) => {
                    const topAction = turn.bot?.details?.topAction;
                    const breakdown = turn.bot?.details?.actionBreakdown;
                    const images = turn.user.images || [];

                    return (
                      <div
                        key={turn.id || idx}
                        onClick={() => jumpToMessage(turn.id, turn.bot?.id)}
                        style={{
                          background: "#141410",
                          border: "1px solid var(--border)",
                          borderRadius: "16px",
                          padding: "14px",
                          cursor: "pointer",
                          transition: "border-color 0.2s, transform 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "rgba(138,223,122,0.4)";
                          e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.transform = "translateY(0)";
                        }}
                      >
                        {/* Top row: Timestamp & Top Action Badge */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--muted)" }}>
                            🕒 {turn.user.timestamp}
                          </span>
                          {topAction && (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(138,223,122,0.15)",
                                border: "1px solid rgba(138,223,122,0.35)",
                                color: "var(--accent)",
                                padding: "2px 8px",
                                borderRadius: "100px",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                fontFamily: "var(--font-mono)",
                              }}
                            >
                              <span>{topAction.icon}</span>
                              <span>{topAction.action}</span>
                              <span>({topAction.percentage}%)</span>
                            </span>
                          )}
                        </div>

                        {/* User Prompt & Attached Photos */}
                        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "10px" }}>
                          {images.length > 0 && (
                            <img
                              src={images[0].url}
                              alt={images[0].name}
                              onClick={() => setActiveLightboxImg(images[0].url)}
                              style={{
                                width: "48px",
                                height: "48px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                border: "1px solid var(--border)",
                                cursor: "pointer",
                                flexShrink: 0,
                              }}
                              title="Click to enlarge"
                            />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--fg)", lineHeight: 1.4 }}>
                              {turn.user.text || "Garment Photo Analysis"}
                            </div>
                            {images.length > 1 && (
                              <div style={{ fontSize: "0.68rem", color: "var(--muted)", marginTop: "2px" }}>
                                + {images.length - 1} more attached photo(s)
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 4-way percentage breakdown preview */}
                        {breakdown && breakdown.length > 0 && (
                          <div
                            style={{
                              background: "rgba(0,0,0,0.35)",
                              borderRadius: "10px",
                              padding: "8px 10px",
                              marginBottom: "10px",
                              border: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", fontFamily: "var(--font-mono)", color: "var(--muted)", marginBottom: "4px" }}>
                              <span>Circular Probability:</span>
                              <span style={{ color: "var(--accent)" }}>{topAction?.reason || "AI Fabric Appraisal"}</span>
                            </div>
                            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                              {breakdown.map((b) => (
                                <span
                                  key={b.action}
                                  style={{
                                    fontSize: "0.68rem",
                                    fontFamily: "var(--font-mono)",
                                    background: "rgba(255,255,255,0.04)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    color: b.action === topAction?.action ? "var(--accent)" : "var(--muted)",
                                    fontWeight: b.action === topAction?.action ? 700 : 500,
                                  }}
                                >
                                  {b.icon} {b.action.replace("To ", "")}: {b.percentage}%
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Eco Metrics & Value Preview */}
                        {(turn.bot?.details?.estimatedValue || turn.bot?.details?.co2Saved) && (
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
                            {turn.bot.details.estimatedValue && (
                              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent2)" }}>
                                💰 {turn.bot.details.estimatedValue}
                              </span>
                            )}
                            {turn.bot.details.co2Saved && (
                              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-mono)", color: "var(--accent)" }}>
                                🌱 {turn.bot.details.co2Saved}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Footer button to jump to full conversation */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
                            Saved in MongoDB
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              jumpToMessage(turn.id, turn.bot?.id);
                            }}
                            style={{
                              background: "rgba(255,255,255,0.04)",
                              border: "1px solid var(--border)",
                              color: "var(--accent)",
                              borderRadius: "100px",
                              padding: "4px 12px",
                              fontSize: "0.75rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "var(--accent)";
                              e.currentTarget.style.color = "#0a0a08";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                              e.currentTarget.style.color = "var(--accent)";
                            }}
                          >
                            Open in Conversation →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Quick Prompts Bar */}
          <div
            style={{
              padding: "8px 16px",
              background: "rgba(255,255,255,0.02)",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
            }}
          >
            {[
              { label: "⚖️ Sell vs Repair vs Donate", prompt: "Which is a better option: to sell, repair, donate, or recycle?" },
              { label: "🏷️ How to Sell Clothes", prompt: "How do I sell clothes on FashionCycle?" },
              { label: "💰 Resale Pricing Guide", prompt: "How should I price my pre-loved clothing?" },
              { label: "🌱 CO₂ & Water Savings", prompt: "How does FashionCycle calculate CO2 and water savings?" },
              { label: "📦 Eco Shipping", prompt: "How does shipping and packaging work?" },
              { label: "💳 Seller Payouts", prompt: "When and how do sellers receive their payout?" },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => triggerStarterPrompt(chip.prompt)}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  padding: "4px 10px",
                  fontSize: "0.72rem",
                  fontFamily: "var(--font-body)",
                  color: "var(--fg)",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "border-color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.background = "rgba(138,223,122,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {messages.map((m) => (
              <div
                key={m.id}
                id={m.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: m.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "100%",
                }}
              >
                <div
                  style={{
                    maxWidth: "92%",
                    padding: "12px 14px",
                    borderRadius: m.sender === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: m.sender === "user" ? "rgba(138,223,122,0.14)" : "rgba(255,255,255,0.04)",
                    border: m.sender === "user" ? "1px solid rgba(138,223,122,0.28)" : "1px solid var(--border)",
                    color: "var(--fg)",
                    fontSize: "0.88rem",
                    lineHeight: "1.45",
                    fontFamily: "var(--font-body)",
                    wordBreak: "break-word",
                    animation: "cardPop 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                >
                  {/* Sent Images */}
                  {m.images && m.images.length > 0 && (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: m.images.length > 1 ? "repeat(2, 1fr)" : "1fr",
                        gap: "8px",
                        marginBottom: m.text ? "10px" : "0",
                      }}
                    >
                      {m.images.map((img) => (
                        <div
                          key={img.id}
                          onClick={() => setActiveLightboxImg(img.url)}
                          style={{
                            position: "relative",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: "1px solid rgba(255,255,255,0.1)",
                            cursor: "pointer",
                            background: "#000",
                          }}
                        >
                          <img
                            src={img.url}
                            alt={img.name}
                            style={{
                              width: "100%",
                              maxHeight: "180px",
                              objectFit: "cover",
                              display: "block",
                              transition: "transform 0.2s ease",
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          />
                          <div
                            style={{
                              position: "absolute",
                              bottom: "4px",
                              right: "4px",
                              background: "rgba(0,0,0,0.75)",
                              borderRadius: "4px",
                              padding: "2px 6px",
                              fontFamily: "var(--font-mono)",
                              fontSize: "0.6rem",
                              color: "var(--accent)",
                            }}
                          >
                            {img.type}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Text content with clean formatting & animations */}
                  {m.text && <FormattedBotMessage text={m.text} sender={m.sender} />}

                  {/* Circular Decision Breakdown (Percentage Bars) */}
                  {m.details?.topAction && m.details?.actionBreakdown && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        background: "rgba(0,0,0,0.4)",
                        border: "1px solid rgba(240,236,227,0.1)",
                        borderRadius: "14px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {/* Top Action Highlight Banner */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 12px",
                          background: "rgba(138,223,122,0.12)",
                          border: "1px solid var(--accent)",
                          borderRadius: "12px",
                          animation: "glowPulse 3s infinite ease-in-out",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "1.2rem" }}>{m.details.topAction.icon}</span>
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--accent)", letterSpacing: "0.08em" }}>
                              ★ RECOMMENDED CHOICE
                            </div>
                            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem", color: "var(--fg)" }}>
                              {m.details.topAction.action}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.3rem", fontWeight: 800, color: "var(--accent)" }}>
                          {m.details.topAction.percentage}%
                        </div>
                      </div>

                      {/* Percentage Breakdown List */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "2px" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--muted)", letterSpacing: "0.06em" }}>
                          CIRCULAR ACTION PROBABILITIES:
                        </div>
                        {m.details.actionBreakdown.map((item) => (
                          <div key={item.action} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.78rem" }}>
                              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-body)", fontWeight: 500, color: "var(--fg)" }}>
                                <span>{item.icon}</span>
                                <span>{item.action}</span>
                              </span>
                              <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: item.color, fontSize: "0.8rem" }}>
                                {item.percentage}%
                              </span>
                            </div>

                            {/* Styled Progress Bar */}
                            <div
                              style={{
                                width: "100%",
                                height: "6px",
                                background: "rgba(255,255,255,0.06)",
                                borderRadius: "100px",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  width: `${item.percentage}%`,
                                  height: "100%",
                                  background: item.color,
                                  borderRadius: "100px",
                                  transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                              />
                            </div>
                            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.68rem", color: "var(--muted)" }}>
                              {item.description}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Extra Structured Fashion Details */}
                  {m.details && (m.details.estimatedValue || m.details.co2Saved) && (
                    <div
                      style={{
                        marginTop: "10px",
                        paddingTop: "10px",
                        borderTop: "1px solid rgba(255,255,255,0.08)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        fontSize: "0.78rem",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {m.details.estimatedValue && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--muted)" }}>Resale Price Estimate:</span>
                          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{m.details.estimatedValue}</span>
                        </div>
                      )}
                      {m.details.co2Saved && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--muted)" }}>CO₂ Prevented:</span>
                          <span style={{ color: "#c8f564" }}>{m.details.co2Saved}</span>
                        </div>
                      )}
                      {m.details.waterSaved && (
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ color: "var(--muted)" }}>Water Conserved:</span>
                          <span style={{ color: "#38bdf8" }}>{m.details.waterSaved}</span>
                        </div>
                      )}
                      {m.details.styleTags && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "4px" }}>
                          {m.details.styleTags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                background: "rgba(255,255,255,0.06)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontSize: "0.65rem",
                                color: "var(--muted)",
                              }}
                            >
                              #{tag.replace(/^#/, "")}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Interactive Follow-up Action Chips */}
                  {m.details?.suggestedPrompts && m.details.suggestedPrompts.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px", paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                      {m.details.suggestedPrompts.map((sug) => (
                        <button
                          key={sug}
                          onClick={() => triggerStarterPrompt(sug)}
                          style={{
                            background: "rgba(138,223,122,0.08)",
                            border: "1px solid rgba(138,223,122,0.3)",
                            borderRadius: "100px",
                            padding: "3px 9px",
                            fontSize: "0.72rem",
                            fontFamily: "var(--font-body)",
                            color: "var(--accent)",
                            cursor: "pointer",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--accent)";
                            e.currentTarget.style.color = "#0a0a08";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(138,223,122,0.08)";
                            e.currentTarget.style.color = "var(--accent)";
                          }}
                        >
                          + {sug}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span
                  style={{
                    fontSize: "0.65rem",
                    color: "var(--muted)",
                    fontFamily: "var(--font-mono)",
                    marginTop: "4px",
                    padding: "0 4px",
                  }}
                >
                  {m.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "4px 0" }}>
                <div
                  style={{
                    padding: "8px 14px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    borderRadius: "18px 18px 18px 4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent)",
                      display: "inline-block",
                      animation: "pulse-green 1s infinite alternate",
                    }}
                  />
                  <span style={{ fontSize: "0.75rem", fontFamily: "var(--font-mono)", color: "var(--muted)" }}>
                    ✨ CycleBot is analyzing garment & circular probabilities...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attached Images Tray Before Sending */}
          {attachedImages.length > 0 && (
            <div
              style={{
                padding: "8px 14px",
                background: "rgba(0,0,0,0.3)",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: "10px",
                overflowX: "auto",
              }}
            >
              {attachedImages.map((img) => (
                <div
                  key={img.id}
                  style={{
                    position: "relative",
                    width: "52px",
                    height: "52px",
                    borderRadius: "8px",
                    overflow: "hidden",
                    border: "1px solid var(--accent)",
                    flexShrink: 0,
                  }}
                >
                  <img src={img.url} alt={img.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    onClick={() => removeAttachedImage(img.id)}
                    style={{
                      position: "absolute",
                      top: "2px",
                      right: "2px",
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.8)",
                      color: "#fff",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                  <span
                    style={{
                      position: "absolute",
                      bottom: "0",
                      left: "0",
                      right: "0",
                      background: "rgba(10,10,8,0.85)",
                      fontSize: "0.55rem",
                      fontFamily: "var(--font-mono)",
                      color: "var(--accent)",
                      textAlign: "center",
                    }}
                  >
                    {img.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Input & Upload Bar */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "12px 14px",
              background: "#0e0e0b",
              borderTop: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {/* Hidden file input accepting all image formats */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.svg,.bmp,.tiff,.avif,.heic"
              multiple
              style={{ display: "none" }}
            />

            {/* Image upload button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload image (All formats: PNG, JPG, WEBP, GIF, SVG, etc.)"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.color = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--muted)";
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={attachedImages.length > 0 ? "Ask CycleBot about this item..." : "Ask CycleBot or drop an image..."}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border)",
                borderRadius: "100px",
                padding: "8px 16px",
                color: "var(--fg)",
                fontSize: "0.88rem",
                fontFamily: "var(--font-body)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() && attachedImages.length === 0}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: (!input.trim() && attachedImages.length === 0) ? "rgba(255,255,255,0.04)" : "var(--accent)",
                color: (!input.trim() && attachedImages.length === 0) ? "var(--muted)" : "#0a0a08",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: (!input.trim() && attachedImages.length === 0) ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                flexShrink: 0,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
          </>
          )}
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {activeLightboxImg && (
        <div
          onClick={() => setActiveLightboxImg(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(8px)",
            zIndex: 100000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh" }}>
            <img
              src={activeLightboxImg}
              alt="Enlarged view"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
              }}
            />
            <button
              onClick={() => setActiveLightboxImg(null)}
              style={{
                position: "absolute",
                top: "-14px",
                right: "-14px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                color: "var(--fg)",
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}
