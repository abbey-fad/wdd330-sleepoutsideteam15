import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img src="${product.Image}" alt="Image of ${product.Name}">
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.Name}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    this.products = await this.dataSource.getData();
  
    this.renderList();
  }
  //renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    //renderListWithTemplate(productCardTemplate, this.listElement, list);

  renderList(list) {
    const limitedProducts = this.products.slice(0, 4); // only take the first 4
    console.log('Rendering products:', limitedProducts);
    renderListWithTemplate(productCardTemplate, this.listElement, limitedProducts, "afterbegin", true);
  }
  
}