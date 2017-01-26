'use strict';

// Check localStorage for prior user signup - if not, initialize it with a data type of Array
// if (localStorage.allSubscribers) {
//   // If allProducts in localStorage, copy values accumulated over the past session
//   allSubscribers = JSON.parse(localStorage.allSubscribers);
//   console.log('Retrieving from localStorage');
//   console.log(allSubscribers);
// } else {
//   console.log('There\'s no local storage!');
//   var allSubscribers = [];
// }
// Check localStorage for all arrays saved in form-app.js
var storageNames = ['allSubscribers', 'allArtists', 'allFeedback'];
for (var i = 0; i < storageNames.length; i++) {
  if (localStorage[storageNames[i]]) {
    console.log(storageNames[i]);
    console.log(localStorage[storageNames[i]]);
    switch (i) {
    case 0:
      var allSubscribers = JSON.parse(localStorage.allSubscribers);
      console.log('Subscribers pulled');
      console.log(allSubscribers);
      break;
    case 1:
      var allArtists = JSON.parse(localStorage.allArtists);
      console.log('Artists pulled');
      console.log(allArtists);
      break;
    case 2:
      var allFeedback = JSON.parse(localStorage.allFeedback);
      console.log('Feedback pulled');
      console.log(allFeedback);
      break;
    default:
      console.log('This was only built for 3 stored arrays.');
    }
  } else {
    switch (i) {
    case 0:
      var allSubscribers = [];
      console.log('clear subscribers');
      break;
    case 1:
      var allArtists = [];
      console.log('clear artists');
      break;
    case 2:
      var allFeedback = [];
      console.log('clear feedback');
      break;
    default:
      console.log('Seriously, this shouldn\'t have happened.');
    }
  }
}

var thanksTimer; // used in signupRequested() to remove a fixed element after a delay
var genreList = ['Breaks', 'Drum and Bass', 'Dubstep', 'Hardcore', 'Hardstyle', 'House', 'Trance', 'Trap', 'Other'];
var interestName;
var allArtists = [];
var allFeedback = [];

// Capture DOM elements
var mainEl = document.getElementById('main-hook');
var newsSignup = document.getElementById('newsletter');
var artistEl = document.getElementById('artist-form');
var feedbackEl = document.getElementById('feedback-form');

newsSignup.addEventListener('submit', signupRequested, false);
artistEl.addEventListener('submit', artistSuggested, false);
feedbackEl.addEventListener('submit', feedbackGiven, false);

// Event listener for newsletter signup
function signupRequested(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log(event.target);
  var name = event.target.subscriber_name.value;
  var email = event.target.subscriber_email.value;
  var interests = {};
  // populate interests with results from the signup form
  for (var i = 0; i < (genreList.length - 1); i++) {
    // last option in array is a string rather than boolean
    interestName = 'genre' + (i + 1);
    console.log(interestName);
    var interestValue = newsSignup.childNodes[1].elements[interestName].checked;
    console.log(interestValue);
    interests[genreList[i]] = interestValue;
  }
  if (newsSignup.childNodes[1].elements['genre_other'].value) {
    interests['other'] = newsSignup.childNodes[1].elements['genre_other'].value;
  }
  // Fallback - keep this code in case something breaks in the loop above
  // interests.interest1 = event.target.int1.checked;
  // interests.interest2 = event.target.int2.checked;
  // interests.interest3 = event.target.int3.checked;
  // for (var i = 0; i < 3; i++) {
  //   var prop = eval('int' + (i + 1));
  //   interests[i] = event.target.prop.value;
  //   console.log(interests);
  // }

  console.log('Name is: ' + name);
  console.log('Email is: ' + email);
  console.log(interests);
  var subscriber = new Subscriber(name,email,interests);
  allSubscribers.push(subscriber);
  saveResponse('allSubscribers', allSubscribers);
}

function artistSuggested(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log(event.target);
  var name = event.target.artist_name.value;
  var url = event.target.artist_link.value;
  if (event.target.artist_comments.value) {
    var comments = event.target.artist_comments.value;
  }
  var suggestion = new Artist(name, url, comments);
  allArtists.push(suggestion);
  saveResponse('allArtists', allArtists);
}

function feedbackGiven(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log(event.target);
  console.log('old feedback');
  console.log(allFeedback);
  if (event.target.feedback_email) {
    var email = event.target.feedback_email.value;
  }
  var text = event.target.feedback_text.value;
  var feedback = new Feedback(email, text);
  allFeedback.push(feedback);
  console.log('new feedback');
  console.log(allFeedback);
  saveResponse('allFeedback', allFeedback);
}

// Constructors for new newsletter subscriber
function Subscriber(name, email, interests) {
  this.name = name;
  this.email = email;
  this.interests = interests;
}

function Artist(name, url, comments) {
  this.artistName = name;
  this.url = url;
  if (comments) {
    this.comments = comments;
  }
}

function Feedback(email, text) {
  if (email) {
    this.email = email;
  }
  this.text = text;
}

function saveResponse(storageName, arrayToBeSaved) {
  localStorage[storageName] = JSON.stringify(arrayToBeSaved); // save change to localStorage
  event.target.reset(); // clear form after submitting
  /* create a popover element (fixed position to be removed after a delay after submitting form)
    setTimeout window method found in a tutorial by Matt Doyle at http://www.elated.com/articles/javascript-timers-with-settimeout-and-setinterval/ */
  var pEl = document.createElement('p');
  pEl.setAttribute('class', 'overlay content');
  pEl.setAttribute('id', 'thank_you');
  pEl.textContent = 'Thank you!';
  mainEl.appendChild(pEl);
  // event.target.remove();
  // set thanksTimer to restore form in 1.5 seconds
  thanksTimer = setTimeout('clearThanks()', 1500);

}

// To clear "thanks" popover
function clearThanks() {
  var pEl = document.getElementById('thank_you');
  pEl.remove();
  // mainEl.insertBefore(newsSignup, document.getElementById('artist_form'));
}

// Ensure URL fields have "http://" prepended before form submission
// Solution by Mosh Feu found at http://stackoverflow.com/a/28282844
// Modified after researching use of "!~" before indexOf.
// Pointy at http://stackoverflow.com/a/12299717 explains its use and advises against it for clarity
function fixUrl (that) {
  console.log('Fix call working!');
  console.log(that);
  var string = that.value;
  if (string.indexOf('http') !== 0) {
    string = 'http://' + string;
  }
  that.value = string;
  return that;
}
