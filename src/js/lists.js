"use strict";

const userInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-btn");
const resultsList = document.querySelector(".js-results-list");
const favoritesList = document.querySelector(".js-favorites-list");
let searchResults = [];
let results = [];
let favorites = [];


function renderResults(anime) {
  const addItem = document.createElement("li");
  const addImg = document.createElement("img");
  const addText = document.createElement("h4");
  const addTitle = document.createTextNode(anime.title);
  addImg.src = anime.img;
  addImg.alt = "No image available for this series";
  addText.appendChild(addTitle);
  addItem.appendChild(addText);
  addItem.appendChild(addImg);
  addItem.setAttribute("class", "results__li");
  addImg.setAttribute("class", "results__img");
  resultsList.appendChild(addItem);
  addItem.addEventListener("click", ()=>{
    favorites.title = anime.title;
    favorites.img = anime.img;
    favorites.push(anime);
    renderFavorites(favorites);
    
});
}

function renderFavorites() {
    const addItem = document.createElement("li");
    const addImg = document.createElement("img");
    const addText = document.createElement("h4");
    const addTitle = document.createTextNode(favorites.title);
    addImg.src = favorites.img;
    addImg.alt = "No image available for this series";
    addText.appendChild(addTitle);
    addItem.appendChild(addText);
    addItem.appendChild(addImg);
    addItem.setAttribute("class", "favorites__li");
    addImg.setAttribute("class", "favorites__img");
    favoritesList.appendChild(addItem);
}


function getList() {
  for (let i = 0; i < searchResults.length; i++) {
    const anime = { title: "", img: "" };
    anime.title = searchResults[i].titles[1].title;
    anime.img = searchResults[i].images.webp.image_url;
    if (
      anime.img ===
      "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"
    ) {
      anime.img = "../images/No-Image.svg";
    }
    results.push(anime);
    renderResults(anime);
  }
}

function handleSearch(event) {
  event.preventDefault();
  let inputValue = userInput.value.toLowerCase();
  fetch(`https://api.jikan.moe/v4/anime?q=${inputValue}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      searchResults = data.data;
      getList(searchResults);
      renderResults(searchResults);
    })
    .catch(function (error) {
        console.error("Fetch error:", error);
    });
}
searchBtn.addEventListener("click", handleSearch);

// let listItem = document.querySelector(".results__li");

// console.log(listItem);




