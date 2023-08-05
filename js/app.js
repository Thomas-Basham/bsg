"use strict";

// *********************** GLOBAL STATE ***********************
let state = {
  username: getUsername(), // TODO: create user object
  game: new Game(), // uses QuizQuestion, Trophies, Tips objects
};

// *********************** CONSTRUCTOR ***********************

// Constructor for a main game object
function Game() {
  this.userScore = 0;
  this.currentLevel = 1;
  this.startButton = document.getElementById("start-button");
  this.trophies = new Trophies();
  this.tips = new Tips();
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
      {
        A: "Cascading Style Sheet",
        B: "Computer Style Sheet",
        C: "Creative Style Sheet",
        D: "Colorful Style Sheet",
      },
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
Game.prototype.setScore = function () {
  localStorage.setItem("userScore", this.userScore.toString());
  localStorage.setItem("currentLevel", this.currentLevel.toString());
};
Game.prototype.renderRestartQuestButton = function () {
  this.startButton.textContent = "RESTART QUEST";

  this.startButton.onclick = function (event) {
    this.currentLevel = 1;
    this.userScore = 0;
    state.game.setScore();
    this.tips.reset();
    this.trophies.reset();
    event.target.textContent = "START QUEST";
    event.target.onclick = handleStartQuest;
  };
};

/**
 * Constructor for a quiz question object
 * @param  {string} question string of a quiz question
 * @param  {string} possibleAnswers object with 4 properties containing answers for the user to choose from
 * @param {string} correctAnswer the correct answer key for this.possibleAnswers object
 * @param {string} successMessage a message that is displayed if user answers correctly
 */
function QuizQuestion(
  question,
  possibleAnswers,
  correctAnswer,
  successMessage
) {
  this.question = question; // string
  this.possibleAnswers = possibleAnswers; // object
  this.correctAnswer = correctAnswer; // string A, B, C, or D
  this.successMessage = successMessage; // string
  this.userAnswer = "";
}
/** QuizQuestion prototype to quiz the user with prompts and
 alerts and update scores to local storage **/
QuizQuestion.prototype.askQuestion = function () {
  let modal = new Modal(this);
  if (state.game.userScore < 8) {
    modal.render();
  } else {
    modal.hide();
  }
};

function Trophies() {
  this.levelElements = document.querySelectorAll(".level-status-div");
}
Trophies.prototype.render = function () {
  for (let i = 0; i < state.game.currentLevel - 1 && i < 4; i++) {
    this.levelElements[i].querySelector("span").onclick = null;
    this.levelElements[i].querySelector("span").textContent = "🏆";
    this.levelElements[i].querySelector("p").textContent = "";
  }
};
Trophies.prototype.reset = function () {
  for (let i = 0; i < this.levelElements.length; i++) {
    state.game.levelElements[i].textContent = "❓";
  }
};

function Tips() {
  this.tipsContainer = document.getElementById("tips-container");
  this.showTipsBtn = document.getElementById("show-tips-btn");
  this.zeroLevelTip = document.getElementById("zero-level-tip");
  this.tipElements = document.querySelectorAll(".tip-ul");
}
Tips.prototype.render = function () {
  if (state.game.currentLevel > 1) {
    this.zeroLevelTip.style.display = "none";
    for (let i = 0; i < state.game.currentLevel - 1 && i < 3; i++) {
      this.tipElements[i].style.display = "block";
    }
  }
};
Tips.prototype.renderAll = function () {
  for (let i = 0; i < 3; i++) {
    this.tipElements[i].style.display = "block";
  }
};
Tips.prototype.reset = function () {
  this.zeroLevelTip.style.display = "block";
  for (let i = 0; i < 3; i++) {
    this.tipElements[i].style.display = "none";
  }
};

function Modal(quizQuestion) {
  let self = this;
  this.quizQuestion = quizQuestion;
  this.modalElement = document.getElementById("modal");
  this.modalQuestion = document.getElementById("modal-question");
  this.submitButton = document.getElementById("submit-btn");
  this.cancelButton = document.getElementById("cancel-btn");
  this.form = this.modalElement.querySelector("form");
  this.inputElements = this.form.querySelectorAll("input");
  this.labelElements = this.form.querySelectorAll("label");
  this.cancelButton.addEventListener("click", function (event) {
    handleHideModal(event, self);
  });
  this.form.addEventListener("submit", function (event) {
    handleFormSubmit(event, self);
  });
  this.nextButton = document.getElementById("next-btn");
  this.nextButton.addEventListener("click", handleStartQuest);
}
Modal.prototype.render = function () {
  // TODO: add incorrect message if wrong
  // TODO: hide next button until after submit
  this.modalElement.style.display = "block";
  this.modalQuestion.textContent = this.quizQuestion.question;
  let answerVals = Object.values(this.quizQuestion.possibleAnswers);
  this.form.style.display = "block";
  for (let i = 0; i < answerVals.length; i++) {
    this.inputElements[i].value = answerVals[i];
    this.labelElements[i].textContent = answerVals[i];
  }
  console.log(this.inputElements);
};
Modal.prototype.hide = function () {
  this.modalElement.style.display = "none";
};
Modal.prototype.sendAnswer = function () {
  const selectedValue = document.querySelector(
    "input[name='possible-solution']:checked"
  ).value;
  console.log(selectedValue);

  state.currentAnswer = selectedValue;
  if (
    selectedValue ===
    this.quizQuestion.possibleAnswers[this.quizQuestion.correctAnswer]
  ) {
    // modal = new Modal(this.successMessage);
    this.modalQuestion.textContent = this.quizQuestion.successMessage;
    this.form.style.display = "none";
    // this.render();
    // alert(this.successMessage);
    state.game.userScore += 1;
    state.game.setScore();
    if (state.game.userScore % 3 === 0) {
      state.game.currentLevel += 1;
      state.game.setScore();
      state.game.tips.render();
      state.game.trophies.render();
      // TODO: Hide next button
      // TODO: change next button text to see current tips! / quest complete
    }

    if (state.game.userScore === 9) {
      state.game.renderRestartQuestButton();
    }
  } else {
    // TODO: shake screen if incorrect
    // alert("Incorrect! Please enter one of the letter options, a, b, c, or d");
  }
  return selectedValue;
};

// *********************** EVENT HANDLING ***********************
// when the page loads, get the local storage data and update the start button text content
function handleOnPageLoad() {
  state.game.getScore();
  if (state.game.currentLevel > 1) {
    state.game.startButton.textContent = "CONTINUE QUEST";
    if (state.game.userScore === 9) {
      state.game.renderRestartQuestButton();
    }
  }
  // add handleShowAllTips handler to the show tips button
  state.game.tips.showTipsBtn.addEventListener("click", handleShowAllTips);
  state.game.tips.render();
  state.game.trophies.render();
  // set the username element
  document.getElementById("username").textContent = state.username;
}
handleOnPageLoad();

/**
 * @param {event} event submit event for quiz form in modal
 * @param {Modal} modal a modal object
 */
function handleFormSubmit(event, modal) {
  event.preventDefault();
  modal.sendAnswer();
}

// click event handler so the user can bypass the game and just see the tips
function handleShowAllTips(event) {
  event.preventDefault();
  state.game.tips.renderAll();
}

// click event on start button. loops through 3 quiz question objects and
// calls the askQuestion() prototype function
function handleStartQuest(event) {
  event.preventDefault();
  state.game.startButton.textContent = "CONTINUE QUEST";

  state.game.quizQuestions[state.game.userScore].askQuestion();
}

function handleHideModal(event, modal) {
  event.preventDefault();
  modal.hide();
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

function setLocalStorageUsername(username) {
  localStorage.setItem("username", username);
}
