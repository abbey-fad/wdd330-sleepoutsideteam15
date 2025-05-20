import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();


function renderCartContents() {
  const cartItems = getLocalStorage("so-cart");
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  // Update cart total AFTER rendering
  updateCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;
  return newItem;
}

// Define cart total functionality
const cartFooter = document.querySelector(".cart-footer");
const cartTotalEl = document.querySelector(".cart-total");

function updateCartTotal(cartItems) {
  if (cartItems.length > 0) {
    const total = cartItems.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
}

// Start rendering the cart and updating total
renderCartContents();