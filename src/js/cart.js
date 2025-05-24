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

  attachRemoveListeners();
  updateCartTotal(uniqueItems);
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
        <button class="remove-btn" data-id="${id}" style="color:red; font-weight:bold; border:none; background:none; cursor:pointer;">X</button>
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

// Remove a single instance of an item from the cart
function removeFromCart(productId) {
  let cart = getLocalStorage("so-cart") || [];

  // Remove just one instance of the item (for quantity)
  const index = cart.findIndex(item => {
    const id = item.Id || item.NameWithoutBrand || item.Name || JSON.stringify(item);
    return id === productId;
  });

  if (index > -1) {
    cart.splice(index, 1); // Remove one instance
    localStorage.setItem("so-cart", JSON.stringify(cart));
    renderCartContents(); // Re-render
  }
}

// Attach remove button listeners
function attachRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-btn");
  removeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
      const productId = e.target.dataset.id;
      removeFromCart(productId);
    });
  });
}
renderCartContents();