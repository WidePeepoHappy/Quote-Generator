const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const language = document.getElementsByName("language");

// Show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Hide loading
function complete() {
  if (!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}
// Get a russian quote from a JSON file
async function getRussianQuote() {
  loading();
  const proxyUrl = "https://glacial-meadow-29649.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=ru&format=json";
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // If Author is blank, add 'Unknown'
    if (data.quoteAuthor === "") {
      authorText.innerText = "Unknown";
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }
    quoteText.innerText = data.quoteText;
    // Stop Loader, Show Quote
    complete();
  } catch (error) {
    getRussianQuote();
  }
}

// Tweet quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, "_blank");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("language") === "russian") {
    newQuoteBtn.innerText = "Новая цитата";
    language[0].checked = true;
    getRussianQuote();
  } else if (localStorage.getItem("language") === "english") {
    newQuoteBtn.innerText = "New Quote";
    language[1].checked = true;
    getEnglishQuote();
  }
});
for (let i = 0; i < language.length; i++) {
  language[i].addEventListener("change", languageChange);
}
newQuoteBtn.addEventListener("click", () => {
  if (language[0].checked === true) {
    getRussianQuote();
  } else {
    getEnglishQuote();
  }
});
twitterBtn.addEventListener("click", tweetQuote);

// Changing language
function languageChange() {
  if (language[0].checked) {
    newQuoteBtn.innerText = "Новая цитата";
    localStorage.setItem("language", "russian");
    getRussianQuote();
  } else {
    newQuoteBtn.innerText = "New Quote";
    localStorage.setItem("language", "english");
    getEnglishQuote();
  }
}

// Get english quote fron an API

async function getEnglishQuote() {
  loading();
  const proxyUrl = "https://glacial-meadow-29649.herokuapp.com/";
  const apiUrl =
    "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // If Author is blank, add 'Unknown'
    if (data.quoteAuthor === "") {
      authorText.innerText = "Unknown";
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add("long-quote");
    } else {
      quoteText.classList.remove("long-quote");
    }
    quoteText.innerText = data.quoteText;
    // Stop Loader, Show Quote
    complete();
  } catch (error) {
    getEnglishQuote();
  }
}
