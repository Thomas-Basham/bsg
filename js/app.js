"use strict";

// *********************** GLOBAL STATE ***********************
// This is lengthy, due to the quiz questions and tip content being stored here
let state = {
  username: getUsername(),
  userScore: 0,
  currentLevel: 1,
  levelElements: document.querySelectorAll(".level-status-div"),
  startButton: document.getElementById("start-button"),
  tipsContainer: document.getElementById("tips-container"),
  showTipsBtn: document.getElementById("show-tips-btn"),
  zeroLevelTip: document.getElementById("zero-level-tip"),
  quizQuestions: [
    new QuizQuestion(
      `Question 1: What is the correct HTML tag for creating a paragraph?
    Options:
    A. <p>
    B. <div>
    C. <span>
    D. <a>
    `,
      "a",
      "That's correct! <p> is the proper HTML tag to create a paragraph."
    ),
    new QuizQuestion(
      `Question 2: Which CSS property is used to change the text color of an element?
      Options:
      A. background-color
      B. font-family
      C. color
      D. text-align
      `,
      "c",
      "Bingo! color is the CSS property to change the text color of an element."
    ),
    new QuizQuestion(
      `Question 3: How do you write a comment in JavaScript?
    Options:
    A. // This is a comment
    B. <!-- This is a comment -->
    C. */ This is a comment /*/
    D. # This is a comment
    `,
      "a",
      "Yes! // this is what a comment looks like in JavaScript"
    ),
    new QuizQuestion(
      `Question 4: Which of the following is not a valid CSS selector?
      Options:
      A. .class-name
      B. #id-name
      C. *element-name
      D. $name
    `,
      "d",
      "That's correct. .class-name, #id-name, and *element-name are all valid CSS selectors"
    ),
    new QuizQuestion(
      `Question 5: What is the purpose of the "if" statement in programming?
      Options:
      A. To loop over a block of code multiple times.
      B. To declare and initialize variables.
      C. To make decisions based on conditions.
      D. To define functions.
    `,
      "c",
      'Right! "if" statements are used to make decisions based on conditions.'
    ),
    new QuizQuestion(
      `Question 6: What does CSS stand for?
      Options:
      A. Cascading Style Sheet
      B. Computer Style Sheet
      C. Creative Style Sheet
      D. Colorful Style Sheet
    `,
      "a",
      "Correct. CSS stands for Cascading Style Sheet."
    ),
    new QuizQuestion(
      `Question 7: What does the acronym "HTTP" stand for?
      Options:
      A. HyperText Markup Protocol
      B. HyperTransfer Markup Protocol
      C. Hypertext Transfer Protocol
      D. High-Throughput Markup Protocol  
    `,
      "c",
      "That's right. HTTP stands for Hypertext Transfer Protocol."
    ),
    new QuizQuestion(
      `Question 8: What is the purpose of a function in programming?
      Options:
      A. To store data temporarily.
      B. To display output on the console.
      C. To perform a specific task or calculation.
      D. To import external libraries.
    `,
      "c",
      "That's right. Functions are used to perform a specific task or calculation."
    ),
    new QuizQuestion(
      `Question 9: What is the correct syntax for declaring a variable in JavaScript?
      Options:
      A. variable x
      B. x = 5
      C. x := 5
      D. let x = 5
    `,
      "d",
      "Yep! 'let' is one way to declare a variable in JavaScript."
    ),
  ],
  tips: document.querySelectorAll(".tip-ul"),
};

// *********************** CONSTRUCTOR ***********************
// Constructor for a quiz question object
function QuizQuestion(question, correctAnswer, successMessage) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.successMessage = successMessage;
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
      setTrophies();
    } else {
      alert("Incorrect! Please enter one of the letter options, a, b, c, or d");
    }
  }
};

// *********************** DOM MANIPULATION ***********************
// If the current level is greater than 1, render current tips on screen,
// else reset the tips to initial state
function setTips() {
  if (state.currentLevel > 1) {
    state.zeroLevelTip.style.display = "none";
    for (let i = 0; i < state.currentLevel - 1 && i < 3; i++) {
      state.tips[i].style.display = "block";
    }
  } else {
    resetTips();
  }
}

// helper function to reset tips to initial app state
function resetTips() {
  state.zeroLevelTip.style.display = "block";
  for (let i = 0; i < 3; i++) {
    state.tips[i].style.display = "none";
  }
}

// helper function to render the 🏆 on the screen for each level that's complete
function setTrophies() {
  for (let i = 0; i < state.currentLevel - 1 && i < 4; i++) {
    state.levelElements[i].querySelector("span").textContent = "🏆";
    state.levelElements[i].querySelector("span").onclick = null;
    state.levelElements[i].querySelector("p").textContent = "";
  }
}

// helper function to reset trophies to initial app state
function resetTrophies() {
  for (let i = 0; i < state.levelElements.length; i++) {
    state.levelElements[i].textContent = "❓";
  }
}

// *********************** EVENT HANDLING ***********************
// when the page loads, get the local storage data and update the start button text content
function handleOnPageLoad() {
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
    tipsUL.innerHTML = state.tips[i];
    state.tipsContainer.appendChild(tipsUL);
  }
}

// click event on start button. loops through 3 quiz question objects and
// calls the askQuestion() prototype function
function startQuest(event) {
  event.preventDefault();
  // resetTips();
  document.getElementById("start-button").textContent = "CONTINUE QUEST";

  for (let i = 0; i < 3; i++) {
    state.quizQuestions[state.userScore].askQuestion();
  }

  // setTips();
  // setTrophies();
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
    resetTrophies();
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
  state.userScore = parseInt(localStorage.getItem("userScore")) || 0;
  state.currentLevel = parseInt(localStorage.getItem("currentLevel")) || 1;
  state.username = localStorage.getItem("username") || null;
  setTips();
  setTrophies();
}
