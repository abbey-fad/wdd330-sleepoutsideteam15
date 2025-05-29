import { loadHeaderFooter, getParam } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";

loadHeaderFooter();

const query = getParam("q");

const dataSource = new ExternalServices();
const listElement = document.querySelector(".product-list");

const productList = new ProductList(query, dataSource, listElement);
productList.init(true); // true = isSearch