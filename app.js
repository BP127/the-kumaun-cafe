// ========== CONFIG ==========
// 1. WhatsApp number (with country code, no + or spaces)
const CAFE_WHATSAPP = "919876543210"; // ← REPLACE with real number

// 2. Google Apps Script Web App URL (paste after you deploy the script)
// Leave empty ("") if you don't want Google Sheets for now
const GOOGLE_SCRIPT_URL = ""; // ← PASTE your Google Script URL here

// ========== STATE ==========
let cart = {}; // { id: qty }
let currentCategory = "all";

// ========== DOM ==========
const menuContainer = document.getElementById("menuContainer");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartTotalEl = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const orderForm = document.getElementById("orderForm");
const successModal = document.getElementById("successModal");
const newOrderBtn = document.getElementById("newOrderBtn");
const categoryNav = document.getElementById("categoryNav");

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  renderMenu();
  setupCategoryNav();
  setupCartEvents();
  loadCartFromStorage();
  showQrHintOnce();
});

// ========== RENDER MENU ==========
function renderMenu() {
  menuContainer.innerHTML = "";
  const categories = currentCategory === "all"
    ? ["beverages", "snacks", "mains", "sweets", "combos"]
    : [currentCategory];

  categories.forEach(cat => {
    const items = MENU.filter(i => i.category === cat);
    if (items.length === 0) return;

    if (currentCategory === "all") {
      const title = document.createElement("h3");
      title.className = "category-title";
      title.textContent = CATEGORY_LABELS[cat];
      menuContainer.appendChild(title);
    }

    items.forEach(item => {
      const el = createMenuItem(item);
      menuContainer.appendChild(el);
    });
  });
}

function createMenuItem(item) {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.dataset.id = item.id;

  const qty = cart[item.id] || 0;

  const imgSrc = item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&auto=format";

  div.innerHTML = `
    <img class="item-image" src="${imgSrc}" alt="${item.name}"
         loading="lazy" decoding="async" referrerpolicy="no-referrer"
         onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&auto=format';" />
    <div class="item-info">
      <div class="item-header">
        <span class="item-name">${item.name}</span>
        ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ""}
      </div>
      <p class="item-desc">${item.desc}</p>
      <div class="item-footer">
        <span class="item-price">₹${item.price}</span>
        <div class="item-actions" data-id="${item.id}">
          ${qty === 0
            ? `<button class="add-btn" aria-label="Add ${item.name}">+</button>`
            : `<div class="qty-controls">
                 <button class="qty-btn minus" aria-label="Decrease">−</button>
                 <span class="qty-value">${qty}</span>
                 <button class="qty-btn plus" aria-label="Increase">+</button>
               </div>`
          }
        </div>
      </div>
    </div>
  `;

  // Event listeners
  const actions = div.querySelector(".item-actions");
  actions.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;
    if (target.classList.contains("add-btn") || target.classList.contains("plus")) {
      addToCart(item.id);
    } else if (target.classList.contains("minus")) {
      removeFromCart(item.id);
    }
  });

  return div;
}

// ========== CATEGORY NAV ==========
function setupCategoryNav() {
  categoryNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;
    document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderMenu();
  });
}

// ========== CART LOGIC ==========
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  saveCart();
  updateUI();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id]--;
  if (cart[id] <= 0) delete cart[id];
  saveCart();
  updateUI();
}

function updateUI() {
  renderMenu(); // re-render to update qty buttons
  renderCartSidebar();
  updateCartBadge();
}

function updateCartBadge() {
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0);
  cartCount.textContent = totalQty;
  cartCount.classList.toggle("hidden", totalQty === 0);
  checkoutBtn.disabled = totalQty === 0;
}

function renderCartSidebar() {
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p class="empty-cart">Your cart is empty. Add something delicious!</p>`;
    cartTotalEl.textContent = "₹0";
    return;
  }

  let html = "";
  let total = 0;

  entries.forEach(([id, qty]) => {
    const item = MENU.find(i => i.id === id);
    if (!item) return;
    const sub = item.price * qty;
    total += sub;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price} × ${qty}</p>
        </div>
        <div class="cart-item-actions">
          <div class="qty-controls">
            <button class="qty-btn minus" data-id="${id}">−</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn plus" data-id="${id}">+</button>
          </div>
        </div>
      </div>
    `;
  });

  cartItemsEl.innerHTML = html;
  cartTotalEl.textContent = `₹${total}`;

  // Attach qty buttons
  cartItemsEl.querySelectorAll(".qty-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (btn.classList.contains("plus")) addToCart(id);
      else removeFromCart(id);
    });
  });
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

function getCartItemsList() {
  return Object.entries(cart).map(([id, qty]) => {
    const item = MENU.find(i => i.id === id);
    return item ? { ...item, qty, subtotal: item.price * qty } : null;
  }).filter(Boolean);
}

// ========== CART SIDEBAR EVENTS ==========
function setupCartEvents() {
  cartBtn.addEventListener("click", openCart);
  closeCart.addEventListener("click", closeCartSidebar);
  cartOverlay.addEventListener("click", closeCartSidebar);
  checkoutBtn.addEventListener("click", openCheckout);
  closeCheckout.addEventListener("click", () => {
    checkoutModal.classList.add("hidden");
  });
  orderForm.addEventListener("submit", handlePlaceOrder);
  newOrderBtn.addEventListener("click", resetForNewOrder);
}

function openCart() {
  cartSidebar.classList.add("open");
  cartOverlay.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.add("hidden");
  document.body.style.overflow = "";
}

// ========== CHECKOUT ==========
function openCheckout() {
  closeCartSidebar();
  const items = getCartItemsList();
  const total = getCartTotal();

  let summaryHtml = items.map(i =>
    `<div class="line"><span>${i.name} × ${i.qty}</span><span>₹${i.subtotal}</span></div>`
  ).join("");
  summaryHtml += `<div class="line total-line"><span>Total</span><span>₹${total}</span></div>`;

  document.getElementById("orderSummaryBox").innerHTML = summaryHtml;
  checkoutModal.classList.remove("hidden");
}

function handlePlaceOrder(e) {
  e.preventDefault();

  const table = document.getElementById("tableNumber").value.trim();
  const name = document.getElementById("customerName").value.trim();
  const notes = document.getElementById("orderNotes").value.trim();

  if (!table) {
    alert("Please enter your table number");
    return;
  }

  const items = getCartItemsList();
  const total = getCartTotal();
  const orderId = "KC" + Date.now().toString().slice(-6);

  const order = {
    id: orderId,
    table,
    name: name || "Guest",
    notes,
    items,
    total,
    time: new Date().toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit"
    }),
    status: "pending"
  };

  // Save to localStorage (for kitchen page on same device)
  saveOrder(order);

  // Save to Google Sheet (if URL is configured)
  saveToGoogleSheet(order);

  // Show success
  showSuccess(order);

  // Clear cart
  cart = {};
  saveCart();
  updateUI();
  checkoutModal.classList.add("hidden");
  orderForm.reset();
}

// ========== GOOGLE SHEETS ==========
function saveToGoogleSheet(order) {
  if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.trim() === "") {
    console.log("Google Sheets URL not set – skipping cloud save");
    return;
  }

  // Flatten items into a readable string
  const itemsText = order.items
    .map(i => `${i.name} x${i.qty} (₹${i.subtotal})`)
    .join(" | ");

  const payload = {
    orderId: order.id,
    timestamp: order.time,
    table: order.table,
    customerName: order.name,
    items: itemsText,
    total: order.total,
    notes: order.notes || "",
    status: order.status
  };

  // Send data (no-cors so it works from any domain)
  fetch(GOOGLE_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => console.log("Order sent to Google Sheet"))
    .catch(err => console.warn("Could not save to Google Sheet:", err));
}

function showSuccess(order) {
  document.getElementById("orderIdDisplay").textContent = order.id;

  let billHtml = `
    <div class="bill-row"><span>Table</span><strong>${order.table}</strong></div>
    <div class="bill-row"><span>Name</span><strong>${order.name}</strong></div>
    <div class="bill-row"><span>Time</span><strong>${order.time}</strong></div>
    <hr style="border:none;border-top:1px dashed #ccc;margin:10px 0">
  `;
  order.items.forEach(i => {
    billHtml += `<div class="bill-row"><span>${i.name} × ${i.qty}</span><span>₹${i.subtotal}</span></div>`;
  });
  if (order.notes) {
    billHtml += `<div class="bill-row" style="margin-top:8px"><span>Notes</span><span>${order.notes}</span></div>`;
  }
  billHtml += `<div class="bill-row bill-total"><span>Total Bill</span><span>₹${order.total}</span></div>`;

  document.getElementById("finalBill").innerHTML = billHtml;

  // WhatsApp message
  const msg = buildWhatsAppMessage(order);
  const waUrl = `https://wa.me/${CAFE_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  document.getElementById("whatsappBtn").href = waUrl;

  successModal.classList.remove("hidden");
}

function buildWhatsAppMessage(order) {
  let text = `🏔️ *THE KUMAUN CAFE - NEW ORDER*\n`;
  text += `━━━━━━━━━━━━━━━━\n`;
  text += `📋 *Order ID:* ${order.id}\n`;
  text += `🪑 *Table:* ${order.table}\n`;
  text += `👤 *Customer:* ${order.name}\n`;
  text += `🕐 *Time:* ${order.time}\n`;
  text += `━━━━━━━━━━━━━━━━\n\n`;
  text += `*ITEMS:*\n`;
  order.items.forEach(i => {
    text += `• ${i.name} × ${i.qty} = ₹${i.subtotal}\n`;
  });
  text += `\n━━━━━━━━━━━━━━━━\n`;
  text += `💰 *TOTAL BILL: ₹${order.total}*\n`;
  if (order.notes) {
    text += `\n📝 *Notes:* ${order.notes}\n`;
  }
  text += `\n_Please prepare this order. Thank you!_`;
  return text;
}

function resetForNewOrder() {
  successModal.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========== STORAGE ==========
function saveCart() {
  localStorage.setItem("kumaun_cart", JSON.stringify(cart));
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem("kumaun_cart");
    if (saved) {
      cart = JSON.parse(saved);
      updateUI();
    }
  } catch (e) {}
}

function saveOrder(order) {
  try {
    const orders = JSON.parse(localStorage.getItem("kumaun_orders") || "[]");
    orders.unshift(order);
    // Keep last 50 orders
    if (orders.length > 50) orders.length = 50;
    localStorage.setItem("kumaun_orders", JSON.stringify(orders));
  } catch (e) {}
}

// ========== QR HINT ==========
function showQrHintOnce() {
  if (!localStorage.getItem("kumaun_hint_seen")) {
    const hint = document.getElementById("qrHint");
    hint.classList.remove("hidden");
    document.getElementById("dismissHint").addEventListener("click", () => {
      hint.classList.add("hidden");
      localStorage.setItem("kumaun_hint_seen", "1");
    });
  }
}
