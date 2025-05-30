console.log("Search handler script loaded!");

import { qs, handleSearch } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = qs("#searchBtn");
  const searchInput = qs("#searchInput");

  if (searchBtn && searchInput) {
    searchBtn.addEventListener("click", () => {
      handleSearch(searchInput);
    });

    // Allow Enter key to trigger search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch(searchInput);
      }
    });
  }
});