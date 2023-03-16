const template = document.querySelector("template");
let content = template.content.cloneNode(true);

const body = document.querySelector("body");
const headContainer = document.querySelector(".head-container");
const dictLogo = document.querySelector(".fa-spell-check");
const fontSelector = document.querySelector(".fa-chevron-down");
const fontDropdown = document.querySelector(".font-dropdown");
const currentFont = document.querySelector(".current-font");
const themeToggler = document.querySelector(".theme-toggler");
const input = document.getElementById("input");
const searchBtn = document.querySelector(".search-btn");
const dataSection = document.querySelector(".data-section");

let partOfSpeech = [];
let definitions = [];
let synonyms = [];
let antonyms = [];

fontSelector.addEventListener("click", (e) => {
  fontDropdown.classList.toggle("active");
});

body.addEventListener("click", (e) => {
  if (e.target === fontSelector) return;
  fontDropdown.classList.remove("active");

  if (e.target === dictLogo) {
    location.href = "index.html";
  }

  if (e.target.classList.contains("fonts")) {
    currentFont.innerText = `${e.target.innerText}`;
  }

  if (e.target.classList.contains("font2")) {
    body.style.fontFamily = `"poppins", sans serif`;
  } else if (e.target.classList.contains("font3")) {
    body.style.fontFamily = `monospace`;
  } else if (e.target.classList.contains("font1")) {
    body.style.fontFamily = `"tinos", serif`;
  }

  if (e.target === themeToggler) {
    body.classList.toggle("theme-change");
    headContainer.classList.toggle("theme-change");
  }
});

searchBtn.addEventListener("click", (e) => {
  dataSection.innerHTML = "";
  if (input.value.trim() === "") {
    invalidSearch();
  }
  const searchItem = input.value.trim();
  fetchData(searchItem);
});

async function fetchData(searchItem) {
  const res = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${searchItem}`
  );
  if (res.ok) {
    dataSection.innerHTML = "";
    content = template.content.cloneNode(true);
    dataSection.append(content);
    const wordContainer = document.querySelector(".word");
    const playBtn = document.querySelector(".play-btn");

    const data = await res.json();
    console.log(data);

    const word = data[0].word;
    createElement("h1", wordContainer, word);

    const phonetic = data[0].phonetic;
    createElement("p", wordContainer, phonetic);

    const audio = data[0].phonetics.find((item) => {
      return item.audio !== "";
    }).audio;
    const newAudio = new Audio(`${audio}`);
    const playAudio = createElement(
      "i",
      playBtn,
      null,
      "fa-4x",
      "fa-solid",
      "fa-circle-play"
    );
    playAudio.addEventListener("click", (e) => {
      newAudio.play();
    });
    createElement("div", playBtn, null, "play-btn-color");

    const meanings = data[0].meanings;
    meanings.forEach((element) => {
      partOfSpeech.push(element.partOfSpeech);
      definitions.push(element.definitions);
      synonyms.push(element.synonyms);
      antonyms.push(element.antonyms);
    });
  } else {
    invalidSearch();
  }
}

function createElement(element, parent, content, ...classes) {
  const newElement = document.createElement(element);
  newElement.innerHTML = content;
  classes.forEach((className) => newElement.classList.add(className));
  parent.appendChild(newElement);
  return newElement;
}

function invalidSearch() {
  dataSection.innerHTML = "";
  const content =
    "couldn't display the result, make sure you search for valid words or try again later...";
  createElement("h1", dataSection, content, "message");
}
