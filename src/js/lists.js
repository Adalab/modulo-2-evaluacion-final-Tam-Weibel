"use strict";

const userInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-btn");
const resetBtn = document.querySelector(".js-reset");
const resultsList = document.querySelector(".js-results-list");
const favoritesList = document.querySelector(".js-favorites-list");
let searchResults = [];
let results = [];
let favorites = JSON.parse(localStorage.getItem("favorites"));

function renderFavorites(data) {
  favoritesList.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const addItem = document.createElement("article");
    const addImg = document.createElement("img");
    const addText = document.createElement("h4");
    const addTitle = document.createTextNode(data[i].title);
    addImg.src = data[i].img;
    addImg.alt = "No image available for this series";
    addText.appendChild(addTitle);
    addItem.appendChild(addText);
    addItem.appendChild(addImg);
    addItem.setAttribute("class", "favorites__card");
    addImg.setAttribute("class", "favorites__img");
    favoritesList.appendChild(addItem);
  }
}

function handleFavorite(dataTitle, dataImg, event) {
  event.currentTarget.classList.add("results__card--fav");
  const anime = { title: dataTitle, img: dataImg };
  if (!favorites) {
    favorites = [];
  }
  const alreadyFav = favorites.find(function (fav) {
    return fav.title === dataTitle;
  });
  if (!alreadyFav) {
    favorites.push(anime);
    renderFavorites(favorites);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } else {
    event.currentTarget.classList.add("results__card--fav");
    const mother = event.currentTarget.parentElement;
    console.log(mother);
    console.log("Anime is already in favorites");
  }
}

function renderResults(data) {
  for (let i = 0; i < data.length; i++) {
    const addItem = document.createElement("article");
    const addImg = document.createElement("img");
    const addText = document.createElement("h4");
    const addTitle = document.createTextNode(data[i].title);
    addImg.src = data[i].img;
    addImg.alt = "No image available for this series";
    addText.appendChild(addTitle);
    addItem.appendChild(addText);
    addItem.appendChild(addImg);
    addItem.setAttribute("class", "results__card");
    addImg.setAttribute("class", "results__img");
    resultsList.appendChild(addItem);

    addItem.addEventListener("click", function (event) {
      handleFavorite(data[i].title, data[i].img, event);
    });
  }
}

function getList() {
  results = [];
  for (let i = 0; i < searchResults.length; i++) {
    const anime = { title: "", img: "" };
    anime.title = searchResults[i].titles[1].title;
    anime.img = searchResults[i].images.webp.image_url;
    if (
      anime.img ===
      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
    ) {
      anime.img = "./images/No-Image.svg";
    }
    results.push(anime);
  }
  renderResults(results);
}

function handleSearch(event) {
  event.preventDefault();
  let inputValue = userInput.value.toLowerCase();
  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (info) {
      searchResults = info.data;
      getList(searchResults);
    })
    .catch(function (error) {
      console.error("Fetch error:", error);
    });
}

function handleReset(event) {
  event.preventDefault();
  localStorage.removeItem("favorites");
  userInput.value = "";
  results = [];
  favorites = [];
}

searchBtn.addEventListener("click", handleSearch);
resetBtn.addEventListener("click", handleReset);
if (favorites && favorites.length) {
  renderFavorites(favorites);
}
