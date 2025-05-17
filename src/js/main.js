import ProductDetails from "./ProductDetails.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from './ProductList.mjs';

async function init() {
  // Create ProductData instance with the category name only (no path)
  const productData = new ProductData('tents');  // <-- pass category, NOT path
  console.log('DOM content loaded?', document.readyState);  // should be 'loading' or 'complete'

  // Load product data asynchronously using getData()
  const products = await productData.getData();  // <-- use getData() method

  console.log('Loaded Products:', products);

  // Select the container element in the DOM where product list will render
  const productListContainer = document.getElementById('product-list');
  
  // Create ProductList instance with category name, data source, and container
  const productList = new ProductList('Tents', productData, productListContainer);
  console.log('Product list container:', productListContainer);

  // Initialize product list rendering or logic
  productList.init();
}

init();
