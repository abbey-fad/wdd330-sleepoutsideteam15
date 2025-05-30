import { getLocalStorage } from "./utils.mjs";

// Aggregate duplicates
function aggregateCartItems(cartItems) {
  const aggregated = {};

  cartItems.forEach(item => {
    const id = item.Id || item.NameWithoutBrand || item.Name || JSON.stringify(item);
    if (!aggregated[id]) {
      aggregated[id] = { ...item, quantity: 1 };
    } else {
      aggregated[id].quantity++;
    }
  });

  return Object.values(aggregated);
}

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimarySmall || "../images/default.jpg";
  const color = item.Colors?.[0]?.ColorName || "N/A";
  const name = item.NameWithoutBrand || item.Name || "Product";
  const qty = item.quantity || 1;
  const id = item.Id || item.NameWithoutBrand || item.Name || JSON.stringify(item);

  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${imageSrc}" alt="${name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${name}</h2>
    </a>
    <p class="cart-card__color">Color: ${color}</p>
    <p class="cart-card__quantity">Qty: ${qty}</p>
    <p class="cart-card__price">$${(item.FinalPrice * qty).toFixed(2)}</p>
    <button class="remove-btn" data-id="${id}">X</button>
  </li>`;
}

function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
    });
  });
}

function removeFromCart(productId) {
  let cart = getLocalStorage("so-cart") || [];

  const index = cart.findIndex(item => {
    const id = item.Id || item.NameWithoutBrand || item.Name || JSON.stringify(item);
    return id === productId;
  });

  if (index > -1) {
    cart.splice(index, 1); // Remove one instance
    localStorage.setItem("so-cart", JSON.stringify(cart));
    new ShoppingCart(".product-list").init(); // Refresh display
  }
}

export default class ShoppingCart {
  constructor(selector) {
    this.cartElement = document.querySelector(selector);
    this.cartTotalEl = document.querySelector(".list-total");
    this.cartFooter = document.querySelector(".list-footer");
  }

  init() {
    const cartItems = getLocalStorage("so-cart") || [];
    if (!this.cartElement) return;

    if (cartItems.length === 0) {
      this.cartElement.innerHTML = "<p>Your cart is empty.</p>";
      this.cartFooter.classList.add("hide");
      return;
    }

    const uniqueItems = aggregateCartItems(cartItems);
    this.cartElement.innerHTML = uniqueItems.map(cartItemTemplate).join("");
    attachRemoveListeners();
    this.updateCartTotal(uniqueItems);
  }

  updateCartTotal(cartItems) {
    if (!this.cartTotalEl || !this.cartFooter) return;

    const total = cartItems.reduce((sum, item) =>
      sum + Number(item.FinalPrice) * (item.quantity || 1), 0);

    this.cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    this.cartFooter.classList.remove("hide");
  }
}