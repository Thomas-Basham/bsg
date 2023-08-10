"use strict";

// *********************** GLOBAL STATE ***********************
let state = {
  game: new Game(), // uses QuizQuestion, Trophies, Tips objects
  user: new User(),
};

// *********************** CONSTRUCTORS ***********************
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
        A: "<p>",
        B: "<div>",
        C: "<span>",
        D: "<a>",
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
  let self = this;
  this.startButton.textContent = "RESTART QUEST";

  this.startButton.onclick = function (event) {
    self.currentLevel = 1;
    self.userScore = 0;
    self.setScore();
    self.tips.reset();
    self.trophies.reset();
    event.target.textContent = "START QUEST";
    event.target.onclick = function (event) {
      handleStartQuest(event);
    };
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
  this.question = question;
  this.possibleAnswers = possibleAnswers;
  this.correctAnswer = correctAnswer;
  this.successMessage = successMessage;
  this.userAnswer = "";
}
/** QuizQuestion prototype to quiz the user with prompts and
 alerts and update scores to local storage **/
QuizQuestion.prototype.askQuestion = function () {
  let modal = new Modal(this);
  if (state.game.userScore < 9) {
    modal.render();
  } else {
    modal.hide();
  }
};

// Constructor for trophies object
function Trophies() {
  this.trophyElements = document.querySelectorAll(".level-status-div");
}
Trophies.prototype.render = function () {
  for (let i = 0; i < state.game.currentLevel - 1 && i < 4; i++) {
    this.trophyElements[i].querySelector("span").onclick = null;
    this.trophyElements[i].querySelector("span").textContent = "🏆";
    this.trophyElements[i].querySelector("p").textContent = "";
  }
};
Trophies.prototype.reset = function () {
  for (let i = 0; i < this.trophyElements.length; i++) {
    this.trophyElements[i].textContent = "❓";
  }
};

// Constructor for tips object
function Tips() {
  this.showTipsBtn = document.getElementById("show-tips-btn");
  this.zeroLevelTipElement = document.getElementById("zero-level-tip");
  this.tipElements = document.querySelectorAll(".tip-div");
}
Tips.prototype.render = function () {
  if (state.game.currentLevel > 1) {
    this.zeroLevelTipElement.style.display = "none";
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
  this.zeroLevelTipElement.style.display = "block";
  for (let i = 0; i < 3; i++) {
    this.tipElements[i].style.display = "none";
  }
};

// Constructor for modal object
function Modal(quizQuestion) {
  let self = this;
  this.quizQuestion = quizQuestion;
  this.modalElement = document.getElementById("modal");
  this.modalHeaderElement = document.getElementById("modal-header");
  this.form = this.modalElement.querySelector("form");
  this.inputElements = self.form.querySelectorAll("input");
  this.labelElements = self.form.querySelectorAll("label");
  this.submitButton = document.getElementById("submit-btn");
  this.cancelButtons = document.getElementsByClassName("close");
  for (let cancelButton of this.cancelButtons) {
    cancelButton.addEventListener("click", function (event) {
      handleHideModal(event, self);
    });
  }
  this.form.addEventListener("submit", function (event) {
    handleFormSubmit(event, self);
  });
  this.nextButton = document.getElementById("next-btn");
  this.nextButton.addEventListener("click", handleStartQuest);
}
Modal.prototype.render = function () {
  this.modalElement.classList.remove("shake");
  this.modalElement.style.display = "block";
  this.modalHeaderElement.textContent = this.quizQuestion.question;
  this.form.style.display = "block";
  this.nextButton.style.display = "none";
  this.nextButton.textContent = "Next";
  let answerVals = Object.values(this.quizQuestion.possibleAnswers);
  for (let i = 0; i < answerVals.length; i++) {
    this.inputElements[i].value = answerVals[i];
    this.labelElements[i].textContent = answerVals[i];
  }
};
Modal.prototype.hide = function () {
  this.modalElement.style.display = "none";
};
Modal.prototype.sendAnswer = function () {
  let self = this;

  this.modalElement.classList.remove("shake");
  void this.modalElement.offsetWidth;

  const selectedValue = document.querySelector(
    "input[name='possible-solution']:checked"
  ).value;

  if (
    selectedValue ===
    this.quizQuestion.possibleAnswers[this.quizQuestion.correctAnswer]
  ) {
    this.modalHeaderElement.textContent = this.quizQuestion.successMessage;
    this.form.style.display = "none";
    this.nextButton.style.display = "block";

    state.game.userScore += 1;
    state.game.setScore();
    if (state.game.userScore % 3 === 0) {
      state.game.currentLevel += 1;
      state.game.setScore();
      state.game.tips.render();
      state.game.trophies.render();
      this.nextButton.removeEventListener("click", handleStartQuest);
      this.nextButton.addEventListener("click", function (event) {
        handleRenderSuccessMessage(event, self);
      });
      this.nextButton.textContent = "See the newly unlocked tips";
    }

    if (state.game.userScore === 9) {
      state.game.renderRestartQuestButton();
    }
  } else {
    this.modalElement.classList.add("shake");
  }
};
Modal.prototype.renderSuccessMessage = function () {
  let self = this;
  this.modalElement.classList.remove("shake");
  void this.modalElement.offsetWidth;
  this.modalHeaderElement.textContent = self.quizQuestion.successMessage;
  console.log(this.nextButton);
  this.nextButton.removeEventListener("click", handleRenderSuccessMessage);
  this.nextButton.addEventListener("click", this.hide());
};

// constructor for user
function User() {
  this.username = localStorage.getItem("username") || "null";
  this.greetingElem = document.getElementById("user-greeting");
  this.usernameElem = document.getElementById("username");
  this.formElem = document.getElementById("username-form");
  this.formElem.addEventListener("submit", handleGetUsername);
}
User.prototype.getUsername = function () {
  if (this.username === null || this.username === "") {
    this.setUsername(this.username);
  }
};
User.prototype.setUsername = function () {
  localStorage.setItem("username", this.username);
};
User.prototype.render = function () {
  if (this.username === "null" || this.username === "") {
    this.greetingElem.style.display = "none";
  } else {
    this.usernameElem.textContent = this.username;
    this.greetingElem.style.display = "block";
    this.formElem.style.display = "none";
  }
};

// *********************** EVENT HANDLING ***********************
// when the page loads, get the local storage data and update the start button text content
function handleOnPageLoad() {
  state.game.getScore();
  if (state.game.currentLevel > 1) {
    state.game.startButton.textContent = "CONTINUE QUEST";
    if (state.game.userScore === state.game.quizQuestions.length) {
      state.game.renderRestartQuestButton();
    }
  }
  state.game.tips.showTipsBtn.addEventListener("click", handleShowAllTips);
  state.game.tips.render();
  state.game.trophies.render();
  state.user.render();
}
handleOnPageLoad();

/**
 *  click event on start button, next button, and ❓ buttons
 * @param {event} event click event
 */
function handleStartQuest(event) {
  event.preventDefault();
  state.game.startButton.textContent = "CONTINUE QUEST";
  state.game.quizQuestions[state.game.userScore].askQuestion();
}

/**
 * Modal event handling
 * @param {event} event submit event
 * @param {Modal} modal a modal object
 */
function handleFormSubmit(event, modal) {
  event.preventDefault();
  modal.sendAnswer();
}
function handleRenderSuccessMessage(event, modal) {
  event.preventDefault();
  modal.renderSuccessMessage();
}
function handleHideModal(event, modal) {
  event.preventDefault();
  modal.hide();
}

// click event handler lets user bypass the game and just see the tips
function handleShowAllTips(event) {
  event.preventDefault();
  state.game.tips.renderAll();
}

// submit event on username form
function handleGetUsername(event) {
  event.preventDefault();
  state.user.username = event.target.username.value;
  state.user.setUsername();
  state.user.render();
}
