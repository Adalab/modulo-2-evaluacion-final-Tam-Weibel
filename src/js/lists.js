"use strict";

const userInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-btn");
const resultsList = document.querySelector(".js-results-list");
const favoritesList = document.querySelector(".js-favorites-list");
let searchResults = [];
let results = [];
let favorites = [];

function renderFavorites(data) {
    favoritesList.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        const addItem = document.createElement("li");
        const addImg = document.createElement("img");
        const addText = document.createElement("h4");
        const addTitle = document.createTextNode(data[i].title);
        addImg.src = data[i].img;
        addImg.alt = "No image available for this series";
        addText.appendChild(addTitle);
        addItem.appendChild(addText);
        addItem.appendChild(addImg);
        addItem.setAttribute("class", "favorites__li");
        addImg.setAttribute("class", "favorites__img");
        favoritesList.appendChild(addItem);
    }
}

function handleFavorite(a, b, event){
    event.currentTarget.setAttribute("class", "results__li--fav");
    const anime = { title: "", img: "" };
    anime.title = a;
    anime.img = b;
    console.log(anime);
    favorites.push(anime);
    renderFavorites(favorites); 
}

function renderResults(data) {
    for (let i = 0; i < data.length; i++) {
      const addItem = document.createElement("li");
      const addImg = document.createElement("img");
      const addText = document.createElement("h4");
      const addTitle = document.createTextNode(data[i].title);
      addImg.src = data[i].img;
      addImg.alt = "No image available for this series";
      addText.appendChild(addTitle);
      addItem.appendChild(addText);
      addItem.appendChild(addImg);
      addItem.setAttribute("class", "results__li");
      addImg.setAttribute("class", "results__img");
      resultsList.appendChild(addItem);
  
      addItem.addEventListener("click", function(event){
        handleFavorite(data[i].title, data[i].img, event)
      }
      );
    }
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
searchBtn.addEventListener("click", handleSearch);




