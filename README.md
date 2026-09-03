# 🏔️ The Kumaun Cafe – Digital Menu & Ordering System

A complete **QR-code based digital menu + ordering system** for **The Kumaun Cafe**.

Customers scan a QR → browse authentic Kumaoni menu on their phone → add items to cart → place order with table number → get a clear bill → send the order instantly to the kitchen via **WhatsApp**.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **QR Digital Menu** | Mobile-first, beautiful menu with categories |
| **Multi-cuisine** | Chinese, Indian & South Indian with cuisine tabs |
| **Live search & filters** | Search dishes, veg/non-veg, spice sort, favourites |
| **Dish detail modal** | Tap any item for full details & quick add |
| **Shopping Cart** | Add / remove items with live quantity controls |
| **Table Ordering** | Customer enters table number + optional name & notes |
| **Bill Generation** | Clear order summary + total |
| **WhatsApp to Kitchen** | One-tap send of complete order to cafe WhatsApp |
| **Google Sheets** | Every order automatically saved as a new row |
| **Kitchen Display** | Simple staff page to see & manage orders (same browser) |
| **QR Generator** | Built-in page to create printable QR codes |
| **Offline-ready cart** | Cart persists in browser |

---

## 📁 Files

```
kumaun-cafe/
├── index.html              ← Customer menu & ordering page
├── kitchen.html            ← Staff / kitchen display
├── qr.html                 ← Generate printable QR codes
├── GOOGLE_SHEETS_SETUP.md  ← How to connect Google Sheets
├── css/style.css
├── js/
│   ├── menu-data.js        ← All menu items & prices (edit here)
│   └── app.js              ← Main logic + WhatsApp + Google Sheet URL
└── README.md
```

---

## 🚀 How to Use (Quick Start)

### 1. Set your WhatsApp number
Open `js/app.js` and change this line near the top:

```js
const CAFE_WHATSAPP = "919876543210"; // ← Replace with your number (country code + number, no + or spaces)
```

Example for Indian number `98765 43210` → `"919876543210"`

### 1b. Connect Google Sheets (optional but recommended)
Follow the full guide in **`GOOGLE_SHEETS_SETUP.md`**.  
After you get the Web App URL, paste it here in `js/app.js`:

```js
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/XXXX/exec";
```

### 2. Host the website (free)

**Easiest options:**

- **Netlify Drop**: Go to [app.netlify.com/drop](https://app.netlify.com/drop) → drag the entire `kumaun-cafe` folder → get a free URL instantly.
- **GitHub Pages**: Push the folder to a GitHub repo → enable Pages.
- **Vercel / Cloudflare Pages**: Also free and fast.

### 3. Generate QR Code
1. Open `qr.html` (after hosting) or use any free QR generator.
2. Paste your menu URL (the link to `index.html`).
3. Print the QR and put one on every table.

### 4. Customer flow
1. Customer scans QR → menu opens on phone.
2. Browses items, adds to cart.
3. Taps **Place Order** → enters table number.
4. Sees bill + Order ID.
5. Taps **Send to Kitchen (WhatsApp)** → message opens with full order details.
6. Staff receives WhatsApp → prepares food → serves.

### 5. Kitchen page (optional)
Open `kitchen.html` on a tablet/laptop in the kitchen.  
**Note:** It only shows orders placed from the **same browser**.  
For real multi-device use, WhatsApp is the primary & most reliable channel for small cafes.

---

## 🍽️ Editing the Menu

Open `js/menu-data.js`.

Each item looks like:

```js
{
  id: "aloo-gutke",
  name: "Aloo Ke Gutke",
  desc: "Spicy roasted potatoes with jakhiya seeds & red chillies",
  price: 90,
  category: "snacks",   // beverages | snacks | mains | sweets | combos
  cuisine: "indian",    // chinese | indian | south-indian
  veg: true,            // vegetarian flag
  spice: 2,             // 0–4 heat level
  badge: "Must Try"     // optional
}
```

Just add, edit or remove objects. Prices are in ₹.

---

## 🎨 Theme
Warm mountain greens + terracotta accents inspired by the hills of Kumaon. Fully responsive and works great on mobile.

---

## 💡 Tips for Real Use

1. **WhatsApp is the backbone** – keep the cafe phone always connected.
2. You can create multiple QR codes later with table pre-filled (advanced).
3. For a more advanced version (real-time multi-device kitchen, online payments, inventory), you can later connect this frontend to **Firebase / Supabase** or use a ready SaaS like Petpooja, Limetray, or the open-source systems linked in research.
4. Print a small “Scan to Order” tent card with the QR + cafe logo for tables.

---

## 📱 Demo Flow (Local)

1. Open `index.html` in a browser.
2. Add items → Place Order → fill table number.
3. On success screen, the WhatsApp button will open with a pre-filled message.
4. Open `kitchen.html` in the **same browser** to see the order appear.

---

Made with ❤️ for **The Kumaun Cafe** – Taste of the Hills.
