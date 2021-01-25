const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
const language = document.getElementsByName('language');

// Show loading
function loading() {
  loader.hidden = false;
  quoteContainer.hidden = true;
}

// Hide loading
function complete() {
  if(!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

// Get Quote From API

async function getRussianQuote() {
  loading();
  let number = Math.floor(Math.random() * 999999);
  const proxyUrl = 'http://api.allorigins.win/get?url=';
  const apiUrl = `http://api.forismatic.com/api/1.0/?method=getQuote&key=${number}&format=json&lang=ru`;
  try {
    const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
    const data = await response.json();
    const quoteObj = JSON.parse(data.contents);
    if (quoteObj.quoteAuthor === '') {
      authorText.innerText = 'Автор неизвестен';
    } else {
      authorText.innerText = quoteObj.quoteAuthor;
    }
    // Reduce font size for long quotes
    if(quoteObj.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = quoteObj.quoteText;
    // Stop loader, Show Quote
    complete();
  } catch (error) {
    console.log(error)
  }
}

// Tweet quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterUrl, '_blank');
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  if(localStorage.getItem('language') === 'russian') {
    newQuoteBtn.innerText = 'Новая цитата';
    language[0].checked = true;
    getRussianQuote();
  } else if(localStorage.getItem('language') === 'english') {
    newQuoteBtn.innerText = 'New Quote';
    language[1].checked = true;
    getEnglishQuote();
  }
});
for(let i=0; i<language.length; i++) {
  language[i].addEventListener('change', languageChange);
}
newQuoteBtn.addEventListener('click', () => {
  if(language[0].checked === true) {
    getRussianQuote();
  } else {
    getEnglishQuote();
  }
});
twitterBtn.addEventListener('click', tweetQuote);

// Changing language
function languageChange() {
  if(language[0].checked) {
    newQuoteBtn.innerText = 'Новая цитата';
    localStorage.setItem('language', 'russian');
    getRussianQuote();
  } else {
    newQuoteBtn.innerText = 'New Quote';
    localStorage.setItem('language', 'english');
    getEnglishQuote();
  }
}

async function getEnglishQuote() {
  loading();
  const apiUrl = 'https://type.fit/api/quotes/?method=getQuote&lang=ru&format=json';
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    let number = Math.floor(Math.random() * data.length);
    let quote;
    if (data[number].author === null) {
      quote = data[number];
      quote.author = "Unknown";
    } else {
      quote = data[number];
    }
    // Reduce font size for long quotes
    if(quote.text.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    authorText.innerText = quote.author;
    quoteText.innerText = quote.text;
    // Stop loader, Show Quote
    complete();
  } catch (error) {
    console.log(error);
  }
}
