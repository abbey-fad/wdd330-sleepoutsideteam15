import { getLocalStorage, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

// Aggregate duplicates and count quantity
function aggregateCartItems(cartItems) {
  const aggregated = {};

  cartItems.forEach(item => {
    // Use a unique key for aggregation, fallback to Name if Id or NameWithoutBrand missing
    const id = item.Id || item.NameWithoutBrand || item.Name || JSON.stringify(item);

    if (!aggregated[id]) {
      aggregated[id] = { ...item, quantity: 1 };
    } else {
      aggregated[id].quantity++;
    }
  });

  return Object.values(aggregated);
}

function renderCartContents() {
  const cartItems = getLocalStorage("so-cart") || [];
  const uniqueItems = aggregateCartItems(cartItems);

  const htmlItems = uniqueItems.map(item => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");

  updateCartTotal(uniqueItems);
}

function cartItemTemplate(item) {
  const imageSrc = item.Images?.PrimarySmall || "../images/default.jpg";
  const color = item.Colors?.[0]?.ColorName || "N/A";
  const name = item.NameWithoutBrand || item.Name || "Product";
  const qty = item.quantity || 1;

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
  </li>`;
}

const cartFooter = document.querySelector(".list-footer");
const cartTotalEl = document.querySelector(".list-total");

function updateCartTotal(cartItems) {
  if (cartItems.length > 0) {
    // Sum price * quantity for each item
    const total = cartItems.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * (item.quantity || 1),
      0
    );
    cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
    cartFooter.classList.remove("hide");
  } else {
    cartFooter.classList.add("hide");
  }
}

renderCartContents();