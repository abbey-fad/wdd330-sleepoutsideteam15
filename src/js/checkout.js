import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const order = new CheckoutProcess("so-cart", ".checkout-summary");
order.init(); // ✅ Fix: previously was incorrectly written as checkout.init()

// Recalculate order total when ZIP changes
document.querySelector("#zip").addEventListener("blur", () => {
  order.calculateOrdertotal();
});

// Handle form submit
document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  e.preventDefault();
  order.checkout();
});