const MENU = [
  // Beverages
  {
    id: "buransh",
    name: "Buransh Juice",
    desc: "Refreshing rhododendron flower juice – a Kumaoni classic",
    price: 80,
    category: "beverages",
    badge: "Local Favourite"
  },
  {
    id: "pahadi-chai",
    name: "Pahadi Chai",
    desc: "Strong mountain-style tea with local spices & herbs",
    price: 40,
    category: "beverages"
  },
  {
    id: "filter-coffee",
    name: "South Indian Filter Coffee",
    desc: "Rich, aromatic filter coffee served in traditional style",
    price: 50,
    category: "beverages"
  },
  {
    id: "masala-chai",
    name: "Masala Chai",
    desc: "Classic spiced Indian tea",
    price: 45,
    category: "beverages"
  },
  {
    id: "lassi",
    name: "Sweet / Salted Lassi",
    desc: "Thick yogurt-based drink – choose sweet or salted",
    price: 60,
    category: "beverages"
  },
  {
    id: "lime-soda",
    name: "Fresh Lime Soda",
    desc: "Freshly squeezed lime with soda – sweet, salted or mixed",
    price: 50,
    category: "beverages"
  },
  {
    id: "cold-coffee",
    name: "Cold Coffee",
    desc: "Creamy blended coffee with ice cream",
    price: 90,
    category: "beverages"
  },

  // Snacks
  {
    id: "aloo-gutke",
    name: "Aloo Ke Gutke",
    desc: "Spicy roasted potatoes with jakhiya seeds & red chillies",
    price: 90,
    category: "snacks",
    badge: "Must Try"
  },
  {
    id: "dal-vada",
    name: "Kumaoni Dal Vada",
    desc: "Crispy lentil fritters made from local dal",
    price: 80,
    category: "snacks"
  },
  {
    id: "bhang-chutney",
    name: "Bhang Ki Chutney + Papad",
    desc: "Tangy hemp-seed chutney served with crispy papad",
    price: 60,
    category: "snacks",
    badge: "Unique"
  },
  {
    id: "honey-chilli",
    name: "Honey Chilli Potato",
    desc: "Crispy potato fingers tossed in sweet & spicy honey-chilli glaze",
    price: 120,
    category: "snacks"
  },
  {
    id: "veg-momos",
    name: "Steamed Veg Momos (6 pcs)",
    desc: "Soft dumplings with spicy tomato chutney",
    price: 100,
    category: "snacks"
  },
  {
    id: "paneer-tikka",
    name: "Paneer Tikka",
    desc: "Grilled cottage cheese with mountain spices",
    price: 160,
    category: "snacks"
  },

  // Mains
  {
    id: "bhatt-churkani",
    name: "Bhatt Ki Churkani",
    desc: "Iconic black soybean curry – rich, earthy & protein-packed. Served with rice",
    price: 180,
    category: "mains",
    badge: "Signature"
  },
  {
    id: "kafuli",
    name: "Kafuli with Mandua Roti",
    desc: "Spinach & fenugreek greens thickened with rice flour + finger millet roti",
    price: 170,
    category: "mains",
    badge: "State Food"
  },
  {
    id: "chainsoo",
    name: "Chainsoo with Rice",
    desc: "Roasted black gram dal – smoky, hearty & warming",
    price: 150,
    category: "mains"
  },
  {
    id: "gahat-dal",
    name: "Gahat Ki Dal with Rice",
    desc: "Horse gram dal slow-cooked with local herbs",
    price: 140,
    category: "mains"
  },
  {
    id: "thechwani",
    name: "Thechwani",
    desc: "Mashed radish & potato curry – rustic comfort food",
    price: 130,
    category: "mains"
  },
  {
    id: "kumaoni-thali",
    name: "Kumaoni Thali",
    desc: "Complete meal: dal, seasonal sabzi, rice, roti, raita, pickle & dessert",
    price: 280,
    category: "mains",
    badge: "Best Value"
  },
  {
    id: "veg-pulao",
    name: "Vegetable Pulao",
    desc: "Fragrant rice cooked with seasonal vegetables & spices",
    price: 140,
    category: "mains"
  },

  // Sweets
  {
    id: "bal-mithai",
    name: "Bal Mithai (2 pcs)",
    desc: "Famous Almora sweet – roasted khoya coated with sugar balls",
    price: 70,
    category: "sweets",
    badge: "Famous"
  },
  {
    id: "singori",
    name: "Singori",
    desc: "Khoya & coconut sweet wrapped in malu leaf",
    price: 50,
    category: "sweets"
  },
  {
    id: "jhangora-kheer",
    name: "Jhangora Kheer",
    desc: "Barnyard millet pudding – light & fragrant",
    price: 80,
    category: "sweets"
  },
  {
    id: "gulab-jamun",
    name: "Gulab Jamun (2 pcs)",
    desc: "Soft milk-solid dumplings in sugar syrup",
    price: 60,
    category: "sweets"
  },

  // Combos
  {
    id: "combo-breakfast",
    name: "Mountain Breakfast Combo",
    desc: "Pahadi Chai + Aloo Gutke + 2 Mandua Roti",
    price: 150,
    category: "combos",
    badge: "Popular"
  },
  {
    id: "combo-lunch",
    name: "Kumaoni Lunch Special",
    desc: "Bhatt Ki Churkani + Rice + Raita + Pickle",
    price: 210,
    category: "combos"
  },
  {
    id: "combo-evening",
    name: "Evening Snacks Combo",
    desc: "Any 2 snacks + 2 hot beverages",
    price: 220,
    category: "combos"
  }
];

const CATEGORY_LABELS = {
  beverages: "Beverages",
  snacks: "Snacks & Starters",
  mains: "Main Course",
  sweets: "Sweets & Desserts",
  combos: "Value Combos"
};
