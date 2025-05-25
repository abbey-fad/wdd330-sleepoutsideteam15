import { getLocalStorage } from "./utils.mjs";

export default class ShoppingCart {
  constructor(selector) {
    this.cartElement = document.querySelector(selector);
    this.cartTotalEl = document.querySelector(".cart-total");
    this.cartFooter = document.querySelector(".cart-footer");
  }

  init() {
    const cartItems = getLocalStorage("so-cart") || [];
    if (!this.cartElement) return;

    if (cartItems.length === 0) {
      this.cartElement.innerHTML = "<p>Your cart is empty.</p>";
      this.updateCartTotal(cartItems);
      return;
    }

    this.cartElement.innerHTML = cartItems.map(this.cartItemTemplate).join("");
    this.updateCartTotal(cartItems);
  }

  cartItemTemplate(item) {
    return `
      <li class="cart-card divider">
        <a href="#" class="cart-card__image">
          <img src="${item.Image}" alt="${item.Name}" />
        </a>
        <a href="#">
          <h2 class="card__name">${item.Name}</h2>
        </a>
        <p class="cart-card__color">${item.Colors?.[0]?.ColorName || "N/A"}</p>
        <p class="cart-card__quantity">qty: 1</p>
        <p class="cart-card__price">$${item.FinalPrice}</p>
      </li>`;
  }

  updateCartTotal(cartItems) {
    if (!this.cartTotalEl || !this.cartFooter) return;

    if (cartItems.length > 0) {
      const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
      this.cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
      this.cartFooter.classList.remove("hide");
    } else {
      this.cartFooter.classList.add("hide");
    }
  }
}