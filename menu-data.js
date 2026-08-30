const MENU = [
  // ========== BEVERAGES ==========
  {
    id: "buransh",
    name: "Buransh Juice",
    desc: "Refreshing rhododendron flower juice – a Kumaoni classic",
    price: 80,
    category: "beverages",
    badge: "Local Favourite",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "pahadi-chai",
    name: "Pahadi Chai",
    desc: "Strong mountain-style tea with local spices & herbs",
    price: 40,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "filter-coffee",
    name: "South Indian Filter Coffee",
    desc: "Rich, aromatic filter coffee served in traditional style",
    price: 50,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    desc: "Classic spiced Indian tea",
    price: 45,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "lassi",
    name: "Sweet / Salted Lassi",
    desc: "Thick yogurt-based drink – choose sweet or salted",
    price: 60,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "lime-soda",
    name: "Fresh Lime Soda",
    desc: "Freshly squeezed lime with soda – sweet, salted or mixed",
    price: 50,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    desc: "Creamy blended coffee with ice cream",
    price: 90,
    category: "beverages",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop&auto=format"
  },

  // ========== SNACKS ==========
  {
    id: "aloo-gutke",
    name: "Aloo Ke Gutke",
    desc: "Spicy roasted potatoes with jakhiya seeds & red chillies",
    price: 90,
    category: "snacks",
    badge: "Must Try",
    image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "dal-vada",
    name: "Kumaoni Dal Vada",
    desc: "Crispy lentil fritters made from local dal",
    price: 80,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "bhang-chutney",
    name: "Bhang Ki Chutney + Papad",
    desc: "Tangy hemp-seed chutney served with crispy papad",
    price: 60,
    category: "snacks",
    badge: "Unique",
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "honey-chilli",
    name: "Honey Chilli Potato",
    desc: "Crispy potato fingers tossed in sweet & spicy honey-chilli glaze",
    price: 120,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "veg-momos",
    name: "Steamed Veg Momos (6 pcs)",
    desc: "Soft dumplings with spicy tomato chutney",
    price: 100,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    desc: "Grilled cottage cheese with mountain spices",
    price: 160,
    category: "snacks",
    image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&h=400&fit=crop&auto=format"
  },

  // ========== MAINS ==========
  {
    id: "bhatt-churkani",
    name: "Bhatt Ki Churkani",
    desc: "Iconic black soybean curry – rich, earthy & protein-packed. Served with rice",
    price: 180,
    category: "mains",
    badge: "Signature",
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "kafuli",
    name: "Kafuli with Mandua Roti",
    desc: "Spinach & fenugreek greens thickened with rice flour + finger millet roti",
    price: 170,
    category: "mains",
    badge: "State Food",
    image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "chainsoo",
    name: "Chainsoo with Rice",
    desc: "Roasted black gram dal – smoky, hearty & warming",
    price: 150,
    category: "mains",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "gahat-dal",
    name: "Gahat Ki Dal with Rice",
    desc: "Horse gram dal slow-cooked with local herbs",
    price: 140,
    category: "mains",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "thechwani",
    name: "Thechwani",
    desc: "Mashed radish & potato curry – rustic comfort food",
    price: 130,
    category: "mains",
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "kumaoni-thali",
    name: "Kumaoni Thali",
    desc: "Complete meal: dal, seasonal sabzi, rice, roti, raita, pickle & dessert",
    price: 280,
    category: "mains",
    badge: "Best Value",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "veg-pulao",
    name: "Vegetable Pulao",
    desc: "Fragrant rice cooked with seasonal vegetables & spices",
    price: 140,
    category: "mains",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop&auto=format"
  },

  // ========== SWEETS ==========
  {
    id: "bal-mithai",
    name: "Bal Mithai (2 pcs)",
    desc: "Famous Almora sweet – roasted khoya coated with sugar balls",
    price: 70,
    category: "sweets",
    badge: "Famous",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "singori",
    name: "Singori",
    desc: "Khoya & coconut sweet wrapped in malu leaf",
    price: 50,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "jhangora-kheer",
    name: "Jhangora Kheer",
    desc: "Barnyard millet pudding – light & fragrant",
    price: 80,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun (2 pcs)",
    desc: "Soft milk-solid dumplings in sugar syrup",
    price: 60,
    category: "sweets",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=400&fit=crop&auto=format"
  },

  // ========== COMBOS ==========
  {
    id: "combo-breakfast",
    name: "Mountain Breakfast Combo",
    desc: "Pahadi Chai + Aloo Gutke + 2 Mandua Roti",
    price: 150,
    category: "combos",
    badge: "Popular",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "combo-lunch",
    name: "Kumaoni Lunch Special",
    desc: "Bhatt Ki Churkani + Rice + Raita + Pickle",
    price: 210,
    category: "combos",
    image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&h=400&fit=crop&auto=format"
  },
  {
    id: "combo-evening",
    name: "Evening Snacks Combo",
    desc: "Any 2 snacks + 2 hot beverages",
    price: 220,
    category: "combos",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=400&fit=crop&auto=format"
  }
];

const CATEGORY_LABELS = {
  beverages: "Beverages",
  snacks: "Snacks & Starters",
  mains: "Main Course",
  sweets: "Sweets & Desserts",
  combos: "Value Combos"
};
