// ========== CONFIG ==========
// Change this to your cafe's WhatsApp number (with country code, no + or spaces)
const CAFE_WHATSAPP = "9664687550"; // ← REPLACE with real number

// Fallback image shown if a dish has no image or the image fails to load
const DEFAULT_DISH_IMAGE = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop&auto=format";

const SORT_MODES = [
  { id: "popular", label: "Sort: Popular" },
  { id: "price-asc", label: "Sort: Price ↑" },
  { id: "price-desc", label: "Sort: Price ↓" },
  { id: "name", label: "Sort: A–Z" },
  { id: "spice", label: "Sort: Spice" }
];

// ========== STATE ==========
let cart = {}; // { id: qty }
let favourites = new Set();
let currentCategory = "all";
let currentCuisine = "all";
let currentDiet = "all";
let searchQuery = "";
let showFavOnly = false;
let sortIndex = 0;
let toastTimer = null;

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
const cuisineNav = document.getElementById("cuisineNav");
const dietFilters = document.getElementById("dietFilters");
const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const resultsCount = document.getElementById("resultsCount");
const itemModal = document.getElementById("itemModal");
const itemModalBody = document.getElementById("itemModalBody");
const closeItemModal = document.getElementById("closeItemModal");
const sortBtn = document.getElementById("sortBtn");
const showFavOnlyBtn = document.getElementById("showFavOnly");
const favBtn = document.getElementById("favBtn");
const favCount = document.getElementById("favCount");
const toastEl = document.getElementById("toast");

// ========== INIT ==========
document.addEventListener("DOMContentLoaded", () => {
  loadFavourites();
  loadCartFromStorage();
  setupCategoryNav();
  setupCuisineNav();
  setupDietFilters();
  setupSearch();
  setupSortAndFav();
  setupCartEvents();
  setupItemModal();
  renderMenu();
  updateFavBadge();
  showQrHintOnce();
});

// ========== FILTERING ==========
function getFilteredItems() {
  const q = searchQuery.trim().toLowerCase();
  let items = MENU.filter((item) => {
    if (currentCategory !== "all" && item.category !== currentCategory) return false;
    if (currentCuisine !== "all" && item.cuisine !== currentCuisine) return false;
    if (currentDiet === "veg" && !item.veg) return false;
    if (currentDiet === "nonveg" && item.veg) return false;
    if (showFavOnly && !favourites.has(item.id)) return false;
    if (q) {
      const hay = `${item.name} ${item.desc} ${item.cuisine} ${item.category} ${item.badge || ""}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const mode = SORT_MODES[sortIndex].id;
  items = [...items].sort((a, b) => {
    if (mode === "price-asc") return a.price - b.price;
    if (mode === "price-desc") return b.price - a.price;
    if (mode === "name") return a.name.localeCompare(b.name);
    if (mode === "spice") return (b.spice || 0) - (a.spice || 0);
    // popular: badge items first, then higher price as proxy for signature dishes
    const ba = a.badge ? 1 : 0;
    const bb = b.badge ? 1 : 0;
    if (bb !== ba) return bb - ba;
    return a.name.localeCompare(b.name);
  });

  return items;
}

// ========== RENDER MENU ==========
function renderMenu() {
  menuContainer.innerHTML = "";
  const filtered = getFilteredItems();
  resultsCount.textContent = filtered.length
    ? `${filtered.length} dish${filtered.length === 1 ? "" : "es"}`
    : "No dishes match your filters";

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-results";
    empty.innerHTML = `
      <div class="empty-results-icon">🔍</div>
      <h3>No matches</h3>
      <p>Try another cuisine, clear search, or switch diet filter.</p>
      <button type="button" class="btn-secondary" id="resetFiltersBtn">Reset filters</button>
    `;
    menuContainer.appendChild(empty);
    empty.querySelector("#resetFiltersBtn").addEventListener("click", resetFilters);
    return;
  }

  const showSectionTitles = currentCategory === "all" && !searchQuery && !showFavOnly;
  const categories = showSectionTitles
    ? ["beverages", "snacks", "mains", "sweets", "combos"]
    : [...new Set(filtered.map((i) => i.category))];

  categories.forEach((cat) => {
    const items = filtered.filter((i) => i.category === cat);
    if (items.length === 0) return;

    if (showSectionTitles || currentCategory === "all") {
      const title = document.createElement("h3");
      title.className = "category-title";
      title.textContent = CATEGORY_LABELS[cat] || cat;
      menuContainer.appendChild(title);
    }

    items.forEach((item, idx) => {
      const el = createMenuItem(item);
      el.style.animationDelay = `${Math.min(idx, 12) * 0.03}s`;
      menuContainer.appendChild(el);
    });
  });
}

function spiceIcons(level) {
  const n = Math.max(0, Math.min(4, level || 0));
  if (n === 0) return `<span class="spice-level mild" title="Mild">Mild</span>`;
  return `<span class="spice-level" title="${SPICE_LABELS[n] || ""}">${"🌶".repeat(n)}</span>`;
}

function cuisineChip(cuisine) {
  const label = (CUISINE_LABELS && CUISINE_LABELS[cuisine]) || cuisine;
  return `<span class="cuisine-chip cuisine-${cuisine}">${label}</span>`;
}

function createMenuItem(item) {
  const div = document.createElement("div");
  div.className = "menu-item";
  div.dataset.id = item.id;
  div.tabIndex = 0;
  div.setAttribute("role", "button");
  div.setAttribute("aria-label", `${item.name}, ₹${item.price}`);

  const qty = cart[item.id] || 0;
  const imgSrc = item.image || DEFAULT_DISH_IMAGE;
  const isFav = favourites.has(item.id);
  const dietClass = item.veg ? "veg" : "nonveg";

  div.innerHTML = `
    <button type="button" class="fav-toggle ${isFav ? "active" : ""}" data-fav="${item.id}" aria-label="${isFav ? "Remove from" : "Add to"} favourites" aria-pressed="${isFav}">
      ${isFav ? "♥" : "♡"}
    </button>
    <img class="item-image" src="${imgSrc}" alt="${escapeHtml(item.name)}"
         loading="lazy" decoding="async" referrerpolicy="no-referrer"
         onerror="this.onerror=null;this.src='${DEFAULT_DISH_IMAGE}';" />
    <div class="item-info">
      <div class="item-header">
        <span class="item-name">
          <span class="diet-dot ${dietClass}" title="${item.veg ? "Vegetarian" : "Non-vegetarian"}"></span>
          ${escapeHtml(item.name)}
        </span>
        ${item.badge ? `<span class="item-badge">${escapeHtml(item.badge)}</span>` : ""}
      </div>
      <div class="item-meta">
        ${cuisineChip(item.cuisine)}
        ${spiceIcons(item.spice)}
      </div>
      <p class="item-desc">${escapeHtml(item.desc)}</p>
      <div class="item-footer">
        <span class="item-price">₹${item.price}</span>
        <div class="item-actions" data-id="${item.id}">
          ${qty === 0
            ? `<button class="add-btn" aria-label="Add ${escapeHtml(item.name)}">+</button>`
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

  const actions = div.querySelector(".item-actions");
  actions.addEventListener("click", (e) => {
    e.stopPropagation();
    const target = e.target.closest("button");
    if (!target) return;
    if (target.classList.contains("add-btn") || target.classList.contains("plus")) {
      addToCart(item.id);
      showToast(`Added ${item.name}`);
    } else if (target.classList.contains("minus")) {
      removeFromCart(item.id);
    }
  });

  div.querySelector(".fav-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavourite(item.id);
  });

  div.addEventListener("click", (e) => {
    if (e.target.closest(".item-actions") || e.target.closest(".fav-toggle")) return;
    openItemDetail(item.id);
  });

  div.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openItemDetail(item.id);
    }
  });

  return div;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ========== NAV / FILTERS ==========
function setupCategoryNav() {
  categoryNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-btn");
    if (!btn) return;
    document.querySelectorAll(".cat-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderMenu();
  });
}

function setupCuisineNav() {
  cuisineNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".cuisine-btn");
    if (!btn) return;
    document.querySelectorAll(".cuisine-btn").forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");
    currentCuisine = btn.dataset.cuisine;
    renderMenu();
  });
}

function setupDietFilters() {
  dietFilters.addEventListener("click", (e) => {
    const btn = e.target.closest(".diet-btn");
    if (!btn) return;
    document.querySelectorAll(".diet-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentDiet = btn.dataset.diet;
    renderMenu();
  });
}

function setupSearch() {
  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      searchQuery = searchInput.value;
      clearSearch.classList.toggle("hidden", !searchQuery);
      renderMenu();
    }, 150);
  });
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearch.classList.add("hidden");
    searchInput.focus();
    renderMenu();
  });
}

function setupSortAndFav() {
  sortBtn.addEventListener("click", () => {
    sortIndex = (sortIndex + 1) % SORT_MODES.length;
    sortBtn.textContent = SORT_MODES[sortIndex].label;
    renderMenu();
  });

  showFavOnlyBtn.addEventListener("click", () => {
    showFavOnly = !showFavOnly;
    showFavOnlyBtn.classList.toggle("active", showFavOnly);
    showFavOnlyBtn.setAttribute("aria-pressed", String(showFavOnly));
    renderMenu();
  });

  favBtn.addEventListener("click", () => {
    showFavOnly = !showFavOnly;
    showFavOnlyBtn.classList.toggle("active", showFavOnly);
    showFavOnlyBtn.setAttribute("aria-pressed", String(showFavOnly));
    renderMenu();
    if (showFavOnly) {
      showToast(favourites.size ? "Showing favourites" : "No favourites yet — tap ♡ on a dish");
    }
  });
}

function resetFilters() {
  currentCategory = "all";
  currentCuisine = "all";
  currentDiet = "all";
  searchQuery = "";
  showFavOnly = false;
  sortIndex = 0;
  searchInput.value = "";
  clearSearch.classList.add("hidden");
  sortBtn.textContent = SORT_MODES[0].label;
  showFavOnlyBtn.classList.remove("active");
  showFavOnlyBtn.setAttribute("aria-pressed", "false");
  document.querySelectorAll(".cat-btn").forEach((b) => b.classList.toggle("active", b.dataset.category === "all"));
  document.querySelectorAll(".cuisine-btn").forEach((b) => {
    const on = b.dataset.cuisine === "all";
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", String(on));
  });
  document.querySelectorAll(".diet-btn").forEach((b) => b.classList.toggle("active", b.dataset.diet === "all"));
  renderMenu();
  showToast("Filters reset");
}

// ========== FAVOURITES ==========
function toggleFavourite(id) {
  if (favourites.has(id)) {
    favourites.delete(id);
    showToast("Removed from favourites");
  } else {
    favourites.add(id);
    showToast("Saved to favourites");
  }
  saveFavourites();
  updateFavBadge();
  renderMenu();
  // keep detail modal heart in sync if open
  if (!itemModal.classList.contains("hidden")) {
    const openId = itemModalBody.dataset.id;
    if (openId === id) openItemDetail(id);
  }
}

function saveFavourites() {
  localStorage.setItem("kumaun_favs", JSON.stringify([...favourites]));
}

function loadFavourites() {
  try {
    const saved = JSON.parse(localStorage.getItem("kumaun_favs") || "[]");
    favourites = new Set(saved);
  } catch (e) {
    favourites = new Set();
  }
}

function updateFavBadge() {
  const n = favourites.size;
  favCount.textContent = n;
  favCount.classList.toggle("hidden", n === 0);
}

// ========== ITEM DETAIL ==========
function setupItemModal() {
  closeItemModal.addEventListener("click", closeItemDetail);
  itemModal.addEventListener("click", (e) => {
    if (e.target === itemModal) closeItemDetail();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !itemModal.classList.contains("hidden")) closeItemDetail();
  });
}

function openItemDetail(id) {
  const item = MENU.find((i) => i.id === id);
  if (!item) return;
  const qty = cart[item.id] || 0;
  const isFav = favourites.has(item.id);
  const imgSrc = item.image || DEFAULT_DISH_IMAGE;
  itemModalBody.dataset.id = item.id;
  itemModalBody.innerHTML = `
    <div class="detail-hero">
      <img src="${imgSrc}" alt="${escapeHtml(item.name)}"
           onerror="this.onerror=null;this.src='${DEFAULT_DISH_IMAGE}';" />
      <button type="button" class="fav-toggle detail-fav ${isFav ? "active" : ""}" data-fav="${item.id}" aria-pressed="${isFav}">
        ${isFav ? "♥" : "♡"}
      </button>
    </div>
    <div class="detail-body">
      <div class="item-meta">
        <span class="diet-dot ${item.veg ? "veg" : "nonveg"}"></span>
        <span class="diet-label">${item.veg ? "Vegetarian" : "Non-vegetarian"}</span>
        ${cuisineChip(item.cuisine)}
        ${spiceIcons(item.spice)}
        ${item.badge ? `<span class="item-badge">${escapeHtml(item.badge)}</span>` : ""}
      </div>
      <h2 id="itemModalTitle">${escapeHtml(item.name)}</h2>
      <p class="detail-desc">${escapeHtml(item.desc)}</p>
      <p class="detail-spice">Heat: <strong>${SPICE_LABELS[item.spice] || "Mild"}</strong></p>
      <div class="detail-footer">
        <span class="item-price">₹${item.price}</span>
        <div class="item-actions detail-actions" data-id="${item.id}">
          ${qty === 0
            ? `<button class="add-btn-wide" type="button">Add to order</button>`
            : `<div class="qty-controls large">
                 <button class="qty-btn minus" type="button">−</button>
                 <span class="qty-value">${qty}</span>
                 <button class="qty-btn plus" type="button">+</button>
               </div>`
          }
        </div>
      </div>
    </div>
  `;

  itemModalBody.querySelector(".fav-toggle").addEventListener("click", () => toggleFavourite(item.id));
  const actions = itemModalBody.querySelector(".item-actions");
  actions.addEventListener("click", (e) => {
    const target = e.target.closest("button");
    if (!target) return;
    if (target.classList.contains("add-btn-wide") || target.classList.contains("plus")) {
      addToCart(item.id);
      showToast(`Added ${item.name}`);
      openItemDetail(item.id);
    } else if (target.classList.contains("minus")) {
      removeFromCart(item.id);
      openItemDetail(item.id);
    }
  });

  itemModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeItemDetail() {
  itemModal.classList.add("hidden");
  if (!cartSidebar.classList.contains("open") &&
      checkoutModal.classList.contains("hidden") &&
      successModal.classList.contains("hidden")) {
    document.body.style.overflow = "";
  }
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
  renderMenu();
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
    const item = MENU.find((i) => i.id === id);
    if (!item) return;
    const sub = item.price * qty;
    total += sub;
    html += `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4><span class="diet-dot ${item.veg ? "veg" : "nonveg"}"></span> ${escapeHtml(item.name)}</h4>
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

  cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      if (btn.classList.contains("plus")) addToCart(id);
      else removeFromCart(id);
    });
  });
}

function getCartTotal() {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = MENU.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
}

function getCartItemsList() {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const item = MENU.find((i) => i.id === id);
      return item ? { ...item, qty, subtotal: item.price * qty } : null;
    })
    .filter(Boolean);
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
  closeItemDetail();
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

  let summaryHtml = items
    .map((i) => `<div class="line"><span>${escapeHtml(i.name)} × ${i.qty}</span><span>₹${i.subtotal}</span></div>`)
    .join("");
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
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }),
    status: "pending"
  };

  saveOrder(order);
  showSuccess(order);

  cart = {};
  saveCart();
  updateUI();
  checkoutModal.classList.add("hidden");
  orderForm.reset();
}

function showSuccess(order) {
  document.getElementById("orderIdDisplay").textContent = order.id;

  let billHtml = `
    <div class="bill-row"><span>Table</span><strong>${escapeHtml(order.table)}</strong></div>
    <div class="bill-row"><span>Name</span><strong>${escapeHtml(order.name)}</strong></div>
    <div class="bill-row"><span>Time</span><strong>${escapeHtml(order.time)}</strong></div>
    <hr style="border:none;border-top:1px dashed #ccc;margin:10px 0">
  `;
  order.items.forEach((i) => {
    billHtml += `<div class="bill-row"><span>${escapeHtml(i.name)} × ${i.qty}</span><span>₹${i.subtotal}</span></div>`;
  });
  if (order.notes) {
    billHtml += `<div class="bill-row" style="margin-top:8px"><span>Notes</span><span>${escapeHtml(order.notes)}</span></div>`;
  }
  billHtml += `<div class="bill-row bill-total"><span>Total Bill</span><span>₹${order.total}</span></div>`;

  document.getElementById("finalBill").innerHTML = billHtml;

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
  order.items.forEach((i) => {
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

// ========== TOAST ==========
function showToast(message) {
  toastEl.textContent = message;
  toastEl.classList.remove("hidden");
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("show");
    setTimeout(() => toastEl.classList.add("hidden"), 250);
  }, 1800);
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
      renderCartSidebar();
      updateCartBadge();
    }
  } catch (e) {}
}

function saveOrder(order) {
  try {
    const orders = JSON.parse(localStorage.getItem("kumaun_orders") || "[]");
    orders.unshift(order);
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
