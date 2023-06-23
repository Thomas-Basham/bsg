"use strict";
let username = prompt("What is your name?");
let currentLevel = 1;
let questionsCorrect = 0;

document.getElementById("username").textContent = username;
document.getElementById("current-level").textContent = currentLevel;

let levelElements = document.querySelectorAll(".level-status");

function startQuest(event) {
  event.preventDefault();
  let question, correctAnswer;

  if (currentLevel == 1) {
    question = prompt(`
    What is the correct HTML tag for creating a paragraph?
    
    A. <p>
    B. <div>
    C. <span>
    D. <a>
    `).toLowerCase();
    correctAnswer = "a";
    if (question == correctAnswer) {
      alert(
        "That's correct! a <p> is the proper HTML tag to create a paragraph."
      );
      setTrophies();
    }
  } else if (currentLevel == 1) {
  } else if (currentLevel == 2) {
  }
}

function setTrophies() {
  for (let i = 0; i < currentLevel; i++) {
    levelElements[i].textContent = "🏆";
    console.log(levelElements[i], "awefawef");
  }
}
