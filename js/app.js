"use strict";

// *********************** GLOBAL STATE ***********************
// This is lengthy, due to the quiz questions being stored here
let state = {
  username: getUsername(),

  game: new Game(),
  // userScore: 0,
  // currentLevel: 1,
  // startButton: document.getElementById("start-button"),

  // levelElements: document.querySelectorAll(".level-status-div"),

  tipsContainer: document.getElementById("tips-container"),
  showTipsBtn: document.getElementById("show-tips-btn"),
  zeroLevelTip: document.getElementById("zero-level-tip"),
  tipElements: document.querySelectorAll(".tip-ul"),
};

// *********************** CONSTRUCTOR ***********************
// Constructor for a quiz question object
function QuizQuestion(
  question,
  possibleAnswers,
  correctAnswer,
  successMessage
) {
  this.question = question; // string
  this.possibleAnswers = possibleAnswers; // object
  this.correctAnswer = correctAnswer; // object[A, B, C, or D]
  this.successMessage = successMessage; // string
}

// QuizQuestion prototype to quiz the user with prompts and
// alerts and update scores to local storage
QuizQuestion.prototype.askQuestion = function () {
  let userAnswer;
  while (userAnswer !== this.correctAnswer) {
    userAnswer = prompt(this.question);

    if (userAnswer !== null) {
      userAnswer = userAnswer.toLowerCase();
    } else {
      break;
    }

    if (userAnswer === this.correctAnswer) {
      alert(this.successMessage);
      state.userScore += 1;
      setLocalStorageUserScore();
      if (state.userScore % 3 === 0) {
        state.currentLevel += 1;
        setTips();
        setLocalStorageUserScore();
      }
      if (state.userScore === 9) {
        showRestartQuestButton();
      }
      state.trophies.setTrophies();
    } else {
      alert("Incorrect! Please enter one of the letter options, a, b, c, or d");
    }
  }
};

function Game() {
  this.userScore = 0;
  this.currentLevel = 1;
  this.startButton = document.getElementById("start-button");
  this.trophies = new Trophies();
  this.quizQuestions = [
    new QuizQuestion(
      "Question 1: What is the correct HTML tag for creating a paragraph?",
      {
        A: "&lt;p>",
        B: "&lt;div>",
        C: "&lt;span>",
        D: "&lt;a>",
      },
      "A",
      "That's correct! <p> is the proper HTML tag to create a paragraph."
    ),
    new QuizQuestion(
      "Question 2: Which CSS property is used to change the text color of an element?",
      {
        A: "background-color",
        B: "font-family",
        C: "color",
        D: "text-align",
      },
      "C",
      "Bingo! color is the CSS property to change the text color of an element."
    ),
    new QuizQuestion(
      "Question 3: How do you write a comment in JavaScript?",
      {
        A: "// This is a comment",
        B: "<!-- This is a comment -->",
        C: "*/ This is a comment /*/",
        D: "# This is a comment",
      },

      "A",
      "Yes! // this is what a comment looks like in JavaScript"
    ),
    new QuizQuestion(
      "Question 4: Which of the following is not a valid CSS selector?",
      {
        A: ".class-name",
        B: "#id-name",
        C: "*element-name",
        D: "$name",
      },
      "D",
      "That's right. .class-name, #id-name, and *element-name are all valid CSS selectors"
    ),
    new QuizQuestion(
      'Question 5: What is the purpose of the "if" statement in programming?',
      {
        A: "To loop over a block of code multiple times.",
        B: "To declare and initialize variables.",
        C: "To make decisions based on conditions.",
        D: "To define functions.",
      },
      "C",
      'Right! "if" statements are used to make decisions based on conditions.'
    ),
    new QuizQuestion(
      `Question 6: What does CSS stand for?`,
      "A",
      "Correct. CSS stands for Cascading Style Sheet."
    ),
    new QuizQuestion(
      `Question 7: What does the acronym "HTTP" stand for?`,
      {
        A: "HyperText Markup Protocol",
        B: "HyperTransfer Markup Protocol",
        C: "Hypertext Transfer Protocol",
        D: "High-Throughput Markup Protocol",
      },
      "C",
      "That's right. HTTP stands for Hypertext Transfer Protocol."
    ),
    new QuizQuestion(
      "Question 8: What is the purpose of a function in programming?",
      {
        A: "To store data temporarily.",
        B: "To display output on the console.",
        C: "To perform a specific task or calculation.",
        D: "To import external libraries.",
      },
      "C",
      "That's right. Functions are used to perform a specific task or calculation."
    ),
    new QuizQuestion(
      "Question 9: What is the correct syntax for declaring a variable in JavaScript?",
      {
        A: "variable x",
        B: "x = 5",
        C: "x := 5",
        D: "let x = 5",
      },
      "D",
      "Yep! 'let' is one way to declare a variable in JavaScript."
    ),
  ];
}
Game.prototype.getScore = function () {
  this.userScore = parseInt(localStorage.getItem("userScore")) || 0;
  this.currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
};

function Trophies() {
  this.levelElements = document.querySelectorAll(".level-status-div");
}
Trophies.prototype.setTrophies = function setTrophies() {
  for (let i = 0; i < state.game.currentLevel - 1 && i < 4; i++) {
    this.levelElements[i].querySelector("span").onclick = null;
    this.levelElements[i].querySelector("span").textContent = "🏆";
    this.levelElements[i].querySelector("p").textContent = "";
  }
};
Trophies.prototype.resetTrophies = function () {
  for (let i = 0; i < this.levelElements.length; i++) {
    state.levelElements[i].textContent = "❓";
  }
};

// *********************** DOM MANIPULATION ***********************
// If the current level is greater than 1, render current tips on screen,
// else reset the tips to initial state
function setTips() {
  if (state.currentLevel > 1) {
    state.zeroLevelTip.style.display = "none";
    for (let i = 0; i < state.currentLevel - 1 && i < 3; i++) {
      state.tipElements[i].style.display = "block";
    }
  } else {
    resetTips();
  }
}

// helper function to reset tips to initial app state
function resetTips() {
  state.zeroLevelTip.style.display = "block";
  for (let i = 0; i < 3; i++) {
    state.tipElements[i].style.display = "none";
  }
}

// helper function to render the 🏆 on the screen for each level that's complete
// function setTrophies() {
//   for (let i = 0; i < state.currentLevel - 1 && i < 4; i++) {
//     state.levelElements[i].querySelector("span").textContent = "🏆";
//     state.levelElements[i].querySelector("span").onclick = null;
//     state.levelElements[i].querySelector("p").textContent = "";
//   }
// }

// helper function to reset trophies to initial app state
// function resetTrophies() {
//   for (let i = 0; i < state.levelElements.length; i++) {
//     state.levelElements[i].textContent = "❓";
//   }
// }

// *********************** EVENT HANDLING ***********************
// when the page loads, get the local storage data and update the start button text content
function handleOnPageLoad() {
  state.game.getScore();
  getLocalStorage();
  if (state.currentLevel > 1) {
    state.startButton.textContent = "CONTINUE QUEST";
    if (state.userScore === 9) {
      showRestartQuestButton();
    }
  }
  // add handleShowAllTips() handler to the show tips button
  state.showTipsBtn.addEventListener("click", handleShowAllTips);

  // set the username element
  document.getElementById("username").textContent = state.username;
}
handleOnPageLoad();

// click event handler so the user can bypass the game and just see the tips
function handleShowAllTips(event) {
  event.preventDefault();
  state.tipsContainer.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    let levelHeading = document.createElement("h2");
    levelHeading.textContent = `Level ${i + 1} tips`;
    state.tipsContainer.appendChild(levelHeading);

    let tipsUL = document.createElement("ul");
    tipsUL.innerHTML = state.tipElements[i];
    state.tipsContainer.appendChild(tipsUL);
  }
}

// click event on start button. loops through 3 quiz question objects and
// calls the askQuestion() prototype function
function startQuest(event) {
  event.preventDefault();
  document.getElementById("start-button").textContent = "CONTINUE QUEST";

  for (let i = 0; i < 3; i++) {
    state.quizQuestions[state.userScore].askQuestion();
  }
}

// updates the start button text and changes the onclick handler to reset everything
// to the initial app state except the username
function showRestartQuestButton() {
  state.startButton.textContent = "RESTART QUEST";

  state.startButton.onclick = function (event) {
    state.currentLevel = 1;
    state.userScore = 0;
    setLocalStorageUserScore();
    resetTips();
    state.trophies.resetTrophies();
    event.target.textContent = "START QUEST";
    event.target.onclick = startQuest;
  };
}

// *********************** LOCAL STORAGE ***********************
// check local storage for username. if not there, prompt user for name
function getUsername() {
  let localStorageUsername = localStorage.getItem("username");
  if (localStorageUsername === null || localStorageUsername === "") {
    let username = prompt("Greetings! What is your name?");
    setLocalStorageUsername(username);
    return username;
  } else return localStorageUsername;
}

function setLocalStorageUserScore() {
  localStorage.setItem("userScore", state.userScore.toString());
  localStorage.setItem("currentLevel", state.currentLevel.toString());
}

function setLocalStorageUsername(username) {
  localStorage.setItem("username", username);
}

// gets the local storage and updates the tips and trophies
function getLocalStorage() {
  // state.userScore = parseInt(localStorage.getItem("userScore")) || 0;
  // state.currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
  // state.username = localStorage.getItem("username") || null;
  setTips();
  setTrophies();
}
