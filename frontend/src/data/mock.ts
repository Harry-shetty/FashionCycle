export const MY_LISTINGS = [
  { id: 1, title: "Acne Studios Wool Scarf", brand: "Acne Studios", size: "OS", price: 78, views: 342, likes: 28, condition: "Like New", img: "https://images.unsplash.com/photo-1619161519929-befcb28d6384?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 2, title: "COS Linen Blazer", brand: "COS", size: "M", price: 95, views: 511, likes: 41, condition: "Excellent", img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 3, title: "Toteme Silk Midi Dress", brand: "Toteme", size: "S", price: 180, views: 728, likes: 63, condition: "Good", img: "https://images.unsplash.com/photo-1664076458686-3449062080ac?w=500&h=660&fit=crop&auto=format", status: "sold" },
  { id: 4, title: "Arket Trench Coat", brand: "Arket", size: "L", price: 145, views: 209, likes: 17, condition: "Good", img: "https://images.unsplash.com/photo-1584216338898-f34d78201414?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 5, title: "Vintage Levi's 501", brand: "Levi's", size: "32", price: 55, views: 102, likes: 8, condition: "Fair", img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 6, title: "Ganni Ruffle Blouse", brand: "Ganni", size: "M", price: 65, views: 88, likes: 12, condition: "Good", img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=500&h=660&fit=crop&auto=format", status: "active" },
];

export const ORDERS = [
  { id: "#FC-00412", item: "Vintage Levi's 501", seller: "Marco R.", date: "Sep 8, 2026", price: 54, status: "Delivered", img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00398", item: "Ganni Ruffle Blouse", seller: "Ana K.", date: "Sep 2, 2026", price: 67, status: "In Transit", img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00371", item: "Bottega Mule Heels", seller: "Lea B.", date: "Aug 25, 2026", price: 210, status: "Delivered", img: "https://images.unsplash.com/photo-1680690653166-1618c3bcdf51?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00366", item: "Stine Goya Blouse", seller: "Emma L.", date: "Aug 15, 2026", price: 85, status: "Delivered", img: "https://images.unsplash.com/photo-1664515226058-03952a19bd76?w=200&h=200&fit=crop&auto=format" },
];

export const FEED = [
  { user: "Elena M.", handle: "@elenam", action: "listed", item: "Sandro Tweed Jacket", price: 120, time: "2m ago", avatar: "EM", img: "https://images.unsplash.com/photo-1731589802397-6a1088d63630?w=400&h=520&fit=crop&auto=format" },
  { user: "Raj Patel", handle: "@rajpstyle", action: "liked your", item: "COS Linen Blazer", price: 95, time: "14m ago", avatar: "RP", img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=400&h=520&fit=crop&auto=format" },
  { user: "Yuki T.", handle: "@yukifashion", action: "listed", item: "Marimekko Canvas Tote", price: 38, time: "1h ago", avatar: "YT", img: "https://images.unsplash.com/photo-1635866127591-9cb87bebbb91?w=400&h=520&fit=crop&auto=format" },
  { user: "Nina Wolf", handle: "@ninawolf", action: "listed", item: "Filippa K Crew Knit", price: 72, time: "3h ago", avatar: "NW", img: "https://images.unsplash.com/photo-1589351189946-b8eb5e170ba6?w=400&h=520&fit=crop&auto=format" },
];

export const RECOMMENDED = [
  { title: "Nanushka Vegan Leather Jacket", brand: "Nanushka", size: "M", price: 195, condition: "Like New", img: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "By Malene Birger Trousers", brand: "BMB", size: "S", price: 88, condition: "Excellent", img: "https://images.unsplash.com/photo-1731589802956-b4693dae884b?w=500&h=680&fit=crop&auto=format", saved: true },
  { title: "Stine Goya Sequin Blouse", brand: "Stine Goya", size: "M", price: 110, condition: "Good", img: "https://images.unsplash.com/photo-1664515226058-03952a19bd76?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "Isabel Marant Belt Bag", brand: "Isabel Marant", size: "OS", price: 155, condition: "Like New", img: "https://images.unsplash.com/photo-1673710672680-944563ff9cce?w=500&h=680&fit=crop&auto=format", saved: false },
];

export const IMPACT = { co2: 48.4, water: 3820, items: 12, money: 836 };
