"use strict";

let state = {
  username: getUsername(),
  userScore: 0,
  currentLevel: 1,
  levelElements: document.querySelectorAll(".level-status"),
  quizQuestions: [
    new QuizQuestion(
      `
    What is the correct HTML tag for creating a paragraph?
    Options:
    A. <p>
    B. <div>
    C. <span>
    D. <a>
    `,
      "a",
      "That's correct! a <p> is the proper HTML tag to create a paragraph."
    ),
    new QuizQuestion(
      `
      Question 2: Which CSS property is used to change the text color of an element?
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
  ],
  tips: [
    `
  <li>
  Stay Engaged and Motivated: Coding bootcamps can be intense and fast-paced. Stay engaged by actively participating in lectures, asking questions, and taking notes. Maintain your motivation by reminding yourself of your goals and the exciting opportunities that lie ahead.
  </li>
  <li>
  Seek Help When Needed: Don't hesitate to ask for help when you encounter challenges or have doubts. Bootcamps often have teaching assistants or mentors who can assist you. Reach out to them, engage in discussions, and leverage their expertise to overcome obstacles and gain a deeper understanding of concepts.
  </li>
  <li>
  Read Documentation and Explore Resources: Learning to navigate documentation is crucial for software development. Get comfortable reading documentation for programming languages, frameworks, and tools. Additionally, explore online resources, tutorials, and coding communities to expand your knowledge and stay updated with the latest trends.
  </li>
  `,
    `
  <li>
  Collaborate and Network: Take advantage of the collaborative environment in your bootcamp. Engage with your peers, form study groups, and participate in coding challenges together. Building a network of fellow learners can provide support, motivation, and opportunities for collaboration in the future.</li>
  <li>
  Embrace the Learning Curve: Coding can be challenging, and it's normal to face difficulties along the way. Embrace the learning curve and view challenges as opportunities for growth. Stay persistent, be patient with yourself, and celebrate small victories as you progress.</li>
  <li>
  Stay Curious and Continuously Learn: The field of software development is constantly evolving. Cultivate a mindset of curiosity and a passion for learning. Stay updated with industry trends, explore new technologies, and continue expanding your knowledge even after the bootcamp ends.</li>
  `,
    `
  <li>
  Practice Regularly: Consistent practice is key to mastering coding concepts. Set aside dedicated time each day to practice coding exercises, work on projects, and reinforce your learning. Regular practice will help solidify your understanding and build your skills.
  </li>
  <li>
  Build a Portfolio: As you complete projects during the bootcamp, create a portfolio to showcase your work. A portfolio demonstrates your skills and provides tangible evidence of your abilities to potential employers. Share your portfolio with others and seek feedback to continuously improve.
  <li>
  Take Care of Yourself: Lastly, remember to take care of your physical and mental well-being. Coding bootcamps can be intense, so prioritize self-care, get enough rest, maintain a balanced lifestyle, and seek support if you feel overwhelmed.`,
  ],
};

function getUsername() {
  let localStorageUsername = localStorage.getItem("username");
  if (localStorageUsername === null) {
    let username = prompt("Greetings! What is your name?");
    setLocalStorageUsername(username);
    return username;
  } else return localStorageUsername;
}

document.getElementById("username").textContent = state.username;

function QuizQuestion(question, correctAnswer, successMessage) {
  this.question = question;
  this.correctAnswer = correctAnswer;
  this.successMessage = successMessage;
}

QuizQuestion.prototype.askQuestion = function () {
  let userAnswer;
  while (userAnswer !== this.correctAnswer) {
    userAnswer = prompt(this.question).toLowerCase();

    if (userAnswer === this.correctAnswer) {
      alert(this.successMessage);
      state.userScore += 1;
      setTrophies();
      setLocalStorageUserScore();
      if (state.userScore % 3 === 0) {
        state.currentLevel += 1;
        setLocalStorageUserScore();
      }
    } else {
      alert("Incorrect!");
    }
  }
};

/* eslint-disable */
function startQuest(event) {
  event.preventDefault();
  document.getElementById("start-button").textContent = "CONTINUE QUEST";

  for (let i = 0; i < 3; i++) {
    state.quizQuestions[state.userScore].askQuestion();
  }

  setTipsAndTrophies();
}

function setTips() {
  if (state.currentLevel > 1) {
    document.getElementById("current-tips").innerHTML == "";
  }

  let tipsContainer = document.getElementById("tips-container");
  for (let i = state.currentLevel - 1; i < state.currentLevel; i++) {
    let levelHeading = document.createElement("h2");
    levelHeading.textContent = `Level ${state.currentLevel} tips`;
    tipsContainer.appendChild(levelHeading);

    let tipsUL = document.createElement("ul");
    tipsUL.innerHTML += state.tips[state.currentLevel - 1]; // minus one for accessing array
    tipsContainer.appendChild(tipsUL);
  }
}

function setTrophies() {
  for (let i = 0; i < state.currentLevel; i++) {
    state.levelElements[i].textContent = "🏆";
  }
}

function setLocalStorageUserScore() {
  localStorage.setItem("userScore", state.userScore.toString());
  localStorage.setItem("currentLevel", state.currentLevel.toString());
}

function setLocalStorageUsername(username) {
  localStorage.setItem("username", username);
}

function getLocalStorage() {
  state.userScore = parseInt(localStorage.getItem("userScore")) || 0;
  state.currentLevel = parseInt(localStorage.getItem("currentLevel")) || 0;
  state.username = localStorage.getItem("username") || null;
  setTips();
  setTrophies();
}

function handleOnPageLoad() {
  getLocalStorage();
  if (state.currentLevel > 0) {
    document.getElementById("start-button").textContent = "CONTINUE QUEST";
  }
}
document.onload = handleOnPageLoad();
