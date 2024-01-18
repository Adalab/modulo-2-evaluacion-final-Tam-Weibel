"use strict";

const userInput = document.querySelector(".js-input");
const searchBtn = document.querySelector(".js-btn");
const resultsList = document.querySelector(".js-results-list");
const favoritesList = document.querySelector(".js-favorites-list");
let searchResults = [];
let anime = { title: "", img: "" };
let results = [];

function renderResults() {
    const addItem = document.createElement("li");
    const addImg = document.createElement("img");
    const addText = document.createElement("h4");
    const addTitle = document.createTextNode(anime.title);
    addImg.src = anime.img;
    addImg.alt = 'No image available for this series';
    addText.appendChild(addTitle);
    addItem.appendChild(addText);
    addItem.appendChild(addImg);
    addItem.setAttribute('class', 'li');
    addImg.setAttribute('class', 'img');
    resultsList.appendChild(addItem);
}

function getList() {
  for (let i = 0; i < searchResults.length; i++) {
    anime.title = searchResults[i].title;
    anime.img = searchResults[i].images.webp.image_url;
    results.push(anime);
    console.log(anime);
    renderResults(anime);
  }
}

function handleSearch(event) {
  event.preventDefault;
  fetch(`https://api.jikan.moe/v4/anime?q=${userInput.value}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      searchResults = data.data;
      getList(searchResults);
      renderResults(searchResults);
    });
}

searchBtn.addEventListener("click", handleSearch);
