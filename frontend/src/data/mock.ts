export const MY_LISTINGS = [
  { id: 1, title: "Sandro Tweed Biker Jacket", brand: "Sandro", size: "M", price: 120, views: 342, likes: 28, condition: "Like New", img: "https://images.unsplash.com/photo-1731589802397-6a1088d63630?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 2, title: "COS Tailored Linen Blazer", brand: "COS", size: "M", price: 95, views: 511, likes: 41, condition: "Excellent", img: "https://images.unsplash.com/photo-1637228393246-c38a4b3d2011?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 3, title: "Massimo Dutti Heavy Wool Long Coat", brand: "Massimo Dutti", size: "M", price: 130, views: 728, likes: 63, condition: "Excellent", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 4, title: "Arket Minimalist Long Trench Coat", brand: "Arket", size: "L", price: 145, views: 209, likes: 17, condition: "Good", img: "https://images.unsplash.com/photo-1584216338898-f34d78201414?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 5, title: "Vintage Levi's 501 Original Fit Denim", brand: "Levi's", size: "32", price: 55, views: 188, likes: 19, condition: "Good", img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=500&h=660&fit=crop&auto=format", status: "active" },
  { id: 6, title: "Ganni Pastel Check Organic Cotton Top", brand: "Ganni", size: "M", price: 65, views: 420, likes: 38, condition: "Like New", img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=500&h=660&fit=crop&auto=format", status: "active" },
];

export const ORDERS = [
  { id: "#FC-00412", item: "Vintage Levi's 501 Original Fit Denim", seller: "Marco R.", date: "Sep 8, 2026", price: 54, status: "Delivered", img: "https://images.unsplash.com/photo-1642359730306-4e80ff12ff6d?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00398", item: "Ganni Pastel Check Organic Cotton Top", seller: "Ana K.", date: "Sep 2, 2026", price: 67, status: "In Transit", img: "https://images.unsplash.com/photo-1624192647570-1131acc12ccf?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00371", item: "Massimo Dutti Heavy Wool Long Overcoat", seller: "Lea B.", date: "Aug 25, 2026", price: 130, status: "Delivered", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&auto=format" },
  { id: "#FC-00366", item: "Studio Nicholson Heavyweight Cotton Tee", seller: "Emma L.", date: "Aug 15, 2026", price: 45, status: "Delivered", img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&fit=crop&auto=format" },
];

export const FEED = [
  { user: "Elena M.", handle: "@elenam", action: "listed", item: "Sandro Tweed Biker Jacket", price: 120, time: "2m ago", avatar: "EM", img: "https://images.unsplash.com/photo-1731589802397-6a1088d63630?w=400&h=520&fit=crop&auto=format" },
  { user: "Raj Patel", handle: "@rajpstyle", action: "liked your", item: "Vintage Ralph Lauren Wool Blazer", price: 85, time: "14m ago", avatar: "RP", img: "https://images.unsplash.com/photo-1629511565591-a1d494ad6c58?w=400&h=520&fit=crop&auto=format" },
  { user: "Yuki T.", handle: "@yukifashion", action: "listed", item: "Acne Studios 1996 Straight Denim", price: 110, time: "1h ago", avatar: "YT", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=520&fit=crop&auto=format" },
  { user: "Nina Wolf", handle: "@ninawolf", action: "listed", item: "Filippa K Ribbed Fisherman Sweater", price: 92, time: "3h ago", avatar: "NW", img: "https://images.unsplash.com/photo-1589351189946-b8eb5e170ba6?w=400&h=520&fit=crop&auto=format" },
];

export const RECOMMENDED = [
  { title: "Nanushka Vegan Leather Moto Jacket", brand: "Nanushka", size: "M", price: 195, condition: "Like New", img: "https://images.unsplash.com/photo-1613915617430-8ab0fd7c6baf?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "Acne Studios 1996 Straight Denim", brand: "Acne Studios", size: "28", price: 110, condition: "Excellent", img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&h=680&fit=crop&auto=format", saved: true },
  { title: "Massimo Dutti Heavy Wool Long Overcoat", brand: "Massimo Dutti", size: "M", price: 130, condition: "Excellent", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&h=680&fit=crop&auto=format", saved: false },
  { title: "Filippa K Ribbed Fisherman Wool Sweater", brand: "Filippa K", size: "L", price: 92, condition: "Like New", img: "https://images.unsplash.com/photo-1589351189946-b8eb5e170ba6?w=500&h=680&fit=crop&auto=format", saved: false },
];

export const IMPACT = { co2: 48.4, water: 3820, items: 12, money: 836 };
