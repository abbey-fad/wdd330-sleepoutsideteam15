import { renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="/product_pages/?product=${product.Id}">
        <img src="${product.Images.PrimaryMedium}" alt="${product.Name}">
        <h3>${product.Brand.Name}</h3>
        <p>${product.NameWithoutBrand}</p>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

export default class ProductList {
  constructor(categoryOrQuery, dataSource, listElement) {
    this.categoryOrQuery = categoryOrQuery;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init(isSearch = false) {
    let list;
    try {
      if (isSearch) {
        list = await this.dataSource.searchProducts(this.categoryOrQuery);
        document.querySelector(".title").textContent = `"${this.categoryOrQuery}"`;
      } else {
        list = await this.dataSource.getData(this.categoryOrQuery);
        document.querySelector(".title").textContent = this.categoryOrQuery;
      }
      this.renderList(list);
    } catch (err) {
      this.listElement.innerHTML = `<li>Unable to load products. Please try again later.</li>`;
    }
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}