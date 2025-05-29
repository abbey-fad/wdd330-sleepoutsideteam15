// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

export function alertMessage(message, scroll = true) {
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `
    <span>${message}</span>
    <button class="alert-close" aria-label="Close alert">✖</button>
  `;
  alert.addEventListener('click', function (e) {
    if (e.target.classList.contains('alert-close') || e.target.innerText === '✖') {
      alert.remove();
    }
  });

  const main = document.querySelector('main');
  main.prepend(alert);

  if (scroll) window.scrollTo({ top: 0, behavior: "smooth" });
}

// ✅ Add this function
export function removeAllAlerts() {
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach(alert => alert.remove());
}

export function handleSearch(inputElement) {
  const query = inputElement.value.trim();
  if (query) {
    // Redirect to your search results page with the query string
    window.location.href = `/search-results.html?q=${encodeURIComponent(query)}`;
  } else {
    alertMessage("Please enter a search term.");
  }
}