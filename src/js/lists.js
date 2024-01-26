"use strict";

const userInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-search-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const favoritesBtn = document.querySelector(".js-favorites-btn");
const resultsList = document.querySelector(".js-results-list");
const favoritesList = document.querySelector(".js-favorites-list");
const noResults = document.querySelector(".js-no-results");
let searchResults = [];
let results = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const API_URL = "https://api.jikan.moe/v4/anime?q=";
const DEPRECATED_NO_IMAGE_URL =
  "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
const NO_IMAGE_URL =
  "https://placehold.jp/24/5e63a1/ffffff/133x200.png?text=No%20Image%20Available";
let apiPage = 1;

function findFavorite(title) {
  return favorites.find((favorite) => favorite.title === title);
}

function renderFavorites(data) {
  favoritesList.innerHTML = "";
  for (const each of data) {
    const favCard = `<article class="favorites__card">                       
                        <span id="${each.id}">${each.title}</span>
                        <img src="${each.img}" alt="${each.title}" class="favorites__img">
                        <span class="favorites__icon js-favorites-icon"><i class="fa-solid fa-trash-can"></i></span>
                    </article>`;
    favoritesList.insertAdjacentHTML("beforeend", favCard);
  }
}

function handleFavorite(id, title, img, event) {
  event.currentTarget.classList.add("results__card--fav");
  const anime = {
    id: id,
    title: title,
    img: img,
  };
  let alreadyFavorite = findFavorite(title);
  if (!alreadyFavorite) {
    favorites.push(anime);
    renderFavorites(favorites);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
    handleDeleteFavoriteCard(alreadyFavorite.title);
  }
}

function renderResults(data) {
  for (const each of data) {
    const addItem = document.createElement("article");
    const addImg = document.createElement("img");
    const addText = document.createElement("p");
    const addTitle = document.createTextNode(each.title);
    addImg.src = each.img;
    addImg.alt = each.title;
    addText.appendChild(addTitle);
    addItem.appendChild(addText);
    addItem.appendChild(addImg);
    addItem.setAttribute("class", "results__card");
    addItem.setAttribute("id", each.id);
    addItem.setAttribute("title", each.title);
    addImg.setAttribute("class", "results__img");
    resultsList.appendChild(addItem);

    let alreadyFavorite = findFavorite(each.title);
    if (alreadyFavorite) {
      addItem.classList.add("results__card--fav");
    }

    addItem.addEventListener("click", (event) =>
      handleFavorite(each.id, each.title, each.img, event)
    );
  }
}

function getList(data) {
  results = [];
  resultsList.innerHTML = "";
  if (searchResults.length === 0) {
    noResults.classList.remove("hidden");
  } else {
    console.log(searchResults);
    noResults.classList.add("hidden");
    results = data.map((eachData) => {
      const anime = {
        id: eachData.mal_id,
        title: eachData.titles[1].title,
        img: eachData.images.webp.image_url,
      };
      if (anime.img === DEPRECATED_NO_IMAGE_URL) {
        anime.img = NO_IMAGE_URL;
      }

      return anime;
    });
    renderResults(results);
  }
}

function getNextPage(input, data) {
  return fetch(API_URL + input + "&page=" + data)
    .then((response) => response.json())
    .then((info) => {
      searchResults = searchResults.concat(info.data);
    })
    .catch((error) => console.error("Fetch error:", error));
}

function handleSearch(event) {
  event.preventDefault();
  const searchInput = userInput.value.toLowerCase();
  fetch(API_URL + searchInput + "&page=" + apiPage)
    .then((response) => response.json())
    .then((info) => {
      searchResults = info.data;
      const pages = info.pagination.has_next_page;
      if (pages) {
        let lastPage = info.pagination.last_visible_page;
        const fetchPromises = [];
        for (let i = 2; i <= lastPage; i++) {
          apiPage = i;
          fetchPromises.push(getNextPage(searchInput, apiPage));
        }
        Promise.all(fetchPromises)
          .then(() => {
            getList(searchResults);
          })
          .catch((error) => console.error("Fetch error:", error));
      } else {
        getList(searchResults);
      }
    })
    .catch((error) => console.error("Fetch error:", error));
}

function handleReset(event) {
  event.preventDefault();
  resultsList.innerHTML = "";
  favoritesList.innerHTML = "";
  localStorage.removeItem("favorites");
  userInput.value = "";
  results = [];
  favorites = [];
}

function handleDeleteAllFavorites(event) {
  event.preventDefault();
  favoritesList.innerHTML = "";
  localStorage.removeItem("favorites");
  for (const favorite of favorites) {
    const selectedResult = resultsList.querySelector(
      `[title="${favorite.title}"]`
    );
    if (selectedResult) {
      selectedResult.classList.remove("results__card--fav");
    }
  }
  favorites = [];
}

function handleDeleteFavoriteCard(title) {
  let favoriteToDeleteIndex = favorites.findIndex(
    (favorite) => favorite.title === title
  );
  if (favoriteToDeleteIndex !== -1) {
    favorites.splice(favoriteToDeleteIndex, 1);
    localStorage.removeItem("favorites");
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites(favorites);
  }
  const selectedResult = resultsList.querySelector(`[title="${title}"]`);
  if (selectedResult) {
    selectedResult.classList.remove("results__card--fav");
  }
}

function handleClickOnIcon(element) {
  const favoriteCard = element.closest(".favorites__card");
  if (favoriteCard) {
    const favoriteTitle = favoriteCard.querySelector(".favorites__img").alt;
    handleDeleteFavoriteCard(favoriteTitle);
  }
}

function init() {
  renderFavorites(favorites);
  searchBtn.addEventListener("click", handleSearch);
  resetBtn.addEventListener("click", handleReset);
  favoritesBtn.addEventListener("click", handleDeleteAllFavorites);
  favoritesList.addEventListener("click", function (event) {
    const favoritesIcon = event.target.closest(".js-favorites-icon");
    if (favoritesIcon) {
      handleClickOnIcon(favoritesIcon);
    }
  });
}

init();

// length de results > 25 muestras botones
// pintar botonoes
// dividir entre 25 para q el entero de la division me marque numero de paginas
// handleNext para mostras siguientes resultados
