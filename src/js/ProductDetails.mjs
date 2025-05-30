import { setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // Fetch product details by ID
    this.product = await this.dataSource.findProductById(this.productId);

    // Render product details into existing HTML elements
    this.renderProductDetails();

    // Add event listener to Add to Cart button
    document
      .getElementById("add-to-cart")
      .addEventListener("click", this.addToCart.bind(this));
  }

  addToCart() {
    let cartContents = getLocalStorage("so-cart");

    // If cart is empty, start with empty array
    if (!cartContents) {
      cartContents = [];
    }

    // Add current product to cart
    cartContents.push(this.product);

    // Save updated cart to local storage
    setLocalStorage("so-cart", cartContents);

    // Alert user
    alertMessage(`${this.product.NameWithoutBrand} added to cart!`);
  }

  renderProductDetails() {
    // Update the elements with product data
    document.getElementById("p-brand").innerText = this.product.Brand.Name;
    document.getElementById("p-name").innerText = this.product.NameWithoutBrand;
    document.getElementById("p-color").innerText = this.product.Colors[0].ColorName;
    document.getElementById("p-description").innerHTML = this.product.DescriptionHtmlSimple;
    document.getElementById("p-price").innerText = `$${this.product.FinalPrice}`;

    // Update image src and alt attributes
    const img = document.getElementById("p-image");
    img.src = this.product.Images.PrimaryLarge;
    img.alt = this.product.NameWithoutBrand;

    // Update Add to Cart button data-id attribute
    const addToCartBtn = document.getElementById("add-to-cart");
    addToCartBtn.dataset.id = this.product.Id;
  }
}