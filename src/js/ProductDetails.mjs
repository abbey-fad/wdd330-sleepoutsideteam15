import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    try {
      // Fix: assign the found product to this.product (not this.products)
      this.product = await this.dataSource.findProductById(this.productId);
      
      if (!this.product) {
        console.error(`No product found with id: ${this.productId}`);
        document.querySelector('h2').textContent = "Product not found";
        return;
      }

      this.renderProductDetails();

      const addToCartBtn = document.getElementById("addToCart");
      if (addToCartBtn) {
        addToCartBtn.addEventListener("click", this.addProductToCart.bind(this));
      } else {
        console.warn("Add to Cart button not found.");
      }
    } catch (error) {
      console.error("Error initializing product details:", error);
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
    alert(`${this.product.Name || 'Product'} added to cart!`);
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  if (!product) {
    console.error("No product to render!");
    return;
  }

  console.log("Rendering product:", product);

  // Update text content and attributes in the DOM
  const brandElement = document.querySelector("h2");
  if (brandElement) brandElement.textContent = product.Brand?.Name || "No Brand";

  const nameElement = document.querySelector("h3");
  if (nameElement) nameElement.textContent = product.NameWithoutBrand || product.Name || "Unnamed Product";

  const productImage = document.getElementById("productImage");
  if (productImage) {
    productImage.src = product.Image || "";
    productImage.alt = product.NameWithoutBrand || product.Name || "Product Image";
  }

  const priceElement = document.getElementById("productPrice");
  if (priceElement) priceElement.textContent = product.FinalPrice ? `$${product.FinalPrice}` : "Price N/A";

  const colorElement = document.getElementById("productColor");
  if (colorElement) colorElement.textContent = product.Colors?.[0]?.ColorName || "Color N/A";

  const descElement = document.getElementById("productDesc");
  if (descElement) descElement.innerHTML = product.DescriptionHtmlSimple || "Description N/A";

  const addToCartBtn = document.getElementById("addToCart");
  if (addToCartBtn) addToCartBtn.dataset.id = product.Id || "";
}