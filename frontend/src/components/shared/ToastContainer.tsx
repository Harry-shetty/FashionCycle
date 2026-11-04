import { useStore } from "../../contexts/StoreContext";

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "2rem",
        right: "2rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isError = toast.type === "error";

        return (
          <div
            key={toast.id}
            style={{
              pointerEvents: "auto",
              background: isError ? "#1a0808" : isSuccess ? "#0b190b" : "#141410",
              border: `1px solid ${isError ? "rgba(239,68,68,0.4)" : isSuccess ? "rgba(138,223,122,0.4)" : "var(--border)"}`,
              borderRadius: "14px",
              padding: "0.85rem 1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              color: isError ? "#ef4444" : isSuccess ? "var(--accent)" : "var(--fg)",
              fontFamily: "var(--font-body)",
              fontSize: "0.875rem",
              fontWeight: 500,
              minWidth: "280px",
              maxWidth: "400px",
              animation: "fadeUp 0.3s cubic-bezier(0.16,1,0.3,1) both",
            }}
          >
            <span>{isError ? "⚠️" : isSuccess ? "✓" : "ℹ️"}</span>
            <span style={{ flex: 1, color: "var(--fg)" }}>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: "none",
                border: "none",
                color: "var(--muted)",
                cursor: "pointer",
                padding: "2px",
                fontSize: "0.9rem",
              }}
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
