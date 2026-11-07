export const MY_LISTINGS = [
  { id: 1, title: "Vintage Ralph Lauren Wool Blazer Jacket", brand: "Ralph Lauren", size: "L", price: 85, views: 342, likes: 28, condition: "Excellent", img: "/products/lst-001-front.jpg", status: "active" },
  { id: 2, title: "Nanushka Vegan Leather Moto Jacket", brand: "Nanushka", size: "M", price: 195, views: 511, likes: 41, condition: "Like New", img: "/products/lst-006-front.jpg", status: "active" },
  { id: 3, title: "Massimo Dutti Heavy Wool Long Overcoat", brand: "Massimo Dutti", size: "M", price: 130, views: 728, likes: 63, condition: "Excellent", img: "/products/lst-003-front.jpg", status: "active" },
  { id: 4, title: "Arket Minimalist Long Trench Coat", brand: "Arket", size: "S", price: 145, views: 209, likes: 17, condition: "Good", img: "/products/lst-008-front.jpg", status: "active" },
  { id: 5, title: "Vintage Levi's 501 Original Fit Denim", brand: "Levi's", size: "32", price: 55, views: 188, likes: 19, condition: "Good", img: "/products/lst-002-front.jpg", status: "active" },
  { id: 6, title: "Ganni Pastel Check Organic Cotton Top", brand: "Ganni", size: "M", price: 65, views: 420, likes: 38, condition: "Like New", img: "/products/lst-009-front.jpg", status: "active" },
];

export const ORDERS = [
  { id: "#FC-00412", item: "Vintage Levi's 501 Original Fit Denim", seller: "Marco R.", date: "Sep 8, 2026", price: 55, status: "Delivered", img: "/products/lst-002-front.jpg" },
  { id: "#FC-00398", item: "Ganni Pastel Check Organic Cotton Top", seller: "Ana K.", date: "Sep 2, 2026", price: 65, status: "In Transit", img: "/products/lst-009-front.jpg" },
  { id: "#FC-00371", item: "Nanushka Vegan Leather Moto Jacket", seller: "Lea B.", date: "Aug 25, 2026", price: 195, status: "Delivered", img: "/products/lst-006-front.jpg" },
  { id: "#FC-00289", item: "Studio Nicholson Heavyweight Boxy Cotton Tee", seller: "Priya Archives", date: "Aug 12, 2026", price: 45, status: "Delivered", img: "/products/lst-004-front.jpg" },
];

export const FEED = [
  { user: "Elena M.", handle: "@elenam", action: "listed", item: "Vintage Ralph Lauren Wool Blazer Jacket", price: 85, time: "2m ago", avatar: "EM", img: "/products/lst-001-front.jpg" },
  { user: "Raj Patel", handle: "@rajpstyle", action: "liked your", item: "Massimo Dutti Heavy Wool Long Overcoat", price: 130, time: "14m ago", avatar: "RP", img: "/products/lst-003-front.jpg" },
  { user: "Yuki T.", handle: "@yukifashion", action: "listed", item: "Acne Studios 1996 High-Rise Straight Denim", price: 110, time: "1h ago", avatar: "YT", img: "/products/lst-007-front.jpg" },
  { user: "Nina Wolf", handle: "@ninawolf", action: "listed", item: "Filippa K Ribbed Fisherman Wool Sweater", price: 92, time: "3h ago", avatar: "NW", img: "/products/lst-005-front.jpg" },
];

export const RECOMMENDED = [
  { title: "Nanushka Vegan Leather Moto Jacket", brand: "Nanushka", size: "M", price: 195, condition: "Like New", img: "/products/lst-006-front.jpg", saved: false },
  { title: "Acne Studios 1996 High-Rise Straight Denim", brand: "Acne Studios", size: "28", price: 110, condition: "Excellent", img: "/products/lst-007-front.jpg", saved: true },
  { title: "Massimo Dutti Heavy Wool Long Overcoat", brand: "Massimo Dutti", size: "M", price: 130, condition: "Excellent", img: "/products/lst-003-front.jpg", saved: false },
  { title: "Loro Piana Chunky Cable-Knit Cashmere Sweater", brand: "Loro Piana", size: "M", price: 240, condition: "Excellent", img: "/products/lst-010-front.jpg", saved: false },
];

export const IMPACT = { co2: 48.4, water: 3820, items: 12, money: 836 };
