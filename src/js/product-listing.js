import { loadHeaderFooter, getParam } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const category = getParam("category");
const dataSource = new ProductData();
const element = document.querySelector(".product-list");

// Get data manually to remove duplicates first
dataSource.getData(category).then((products) => {
  // Remove duplicate products by their Id
  const seen = new Set();
  const uniqueProducts = products.filter(product => {
    if (seen.has(product.Id)) return false;
    seen.add(product.Id);
    return true;
  });

  // Create a mock dataSource that returns the cleaned list
  const filteredDataSource = {
    getData: () => Promise.resolve(uniqueProducts)
  };

  const listing = new ProductList(category, filteredDataSource, element);
  listing.init();
});