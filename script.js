import Block from './Block.js';
import Food from './Food.js';
import Snake from './Snake.js';
import Game from './Game.js';

'use strict';

// -------------------------------------------------- GLOBAL VARIABLES -------------------------------------------------- //

// Initialize 2d drawing context for canvas element.
let canvas = document.querySelector(".snake-game__display");
let context = canvas.getContext("2d");

let game = new Game(context, canvas);

// Visual element used to toggle theme settings.
const TOGGLEON = "fa-toggle-on";
const TOGGLEOFF = "fa-toggle-off";

// Selector for toggle icon that allows user to select light or dark theme.
let theme = document.querySelector(".theme-toggle");

// -------------------------------------------------- EVENT LISTENERS -------------------------------------------------- //

// Initialize the game and background theme.
window.addEventListener("load", () => {

    theme.classList.add('fas', 'fa-toggle-off');
    theme.style.fontSize = '30px';
    theme.style.cursor = 'pointer';
    loadTheme();

    game.displayStart();

});

// Move the snake based on user input of arrow keys.
document.addEventListener("keydown", (event) => {

    if (game.state.gamePaused) {

        game.resolvePausedGame(event);
        
    } else if (event.code == "Enter") { 

        game.handleEnterKey()

    } else if (!game.snake.inputLocked) {
        
        game.snake.direction = event.code;

    }

});

// Set the background theme whene user clicks on toggle element.
theme.addEventListener("click", setTheme);

// Load a background theme.
function loadTheme() {

    let style = localStorage.getItem("THEME");

    if (style == "dark") {

        let element = document.getElementById("toggle");

        element.classList.toggle(TOGGLEON);
        element.classList.toggle(TOGGLEOFF);

        document.body.style.background = "rgba(0, 0, 0, 0.75)";

    }

}

// Display a background theme depending on the toggle element.
function setTheme() {

    let element = event.target;

    element.classList.toggle(TOGGLEON);
    element.classList.toggle(TOGGLEOFF);

    if (element.classList.contains(TOGGLEON)) {

        document.body.style.background = "rgba(0, 0, 0, 0.75)";
        localStorage.setItem("THEME", "dark");

    } else {

        document.body.style.background = "whitesmoke";
        localStorage.setItem("THEME", "light");

    }

}