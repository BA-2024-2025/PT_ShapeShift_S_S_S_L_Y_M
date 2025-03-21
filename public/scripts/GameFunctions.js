import { TTetromino } from "./TTetromino.js";
import { OTetromino } from "./OTetromino.js";
import { ITetromino } from "./ITetromino.js";
import { LTetromino } from "./LTetromino.js";
import { JTetromino } from "./JTetromino.js";
import { ZTetromino } from "./ZTetromino.js";
import { STetromino } from "./STetromino.js";
import { PlusTetromino } from "./PlusTetromino.js";
import { UTetromino } from "./UTetromino.js";
import { createGrid, clearBattlefield, drawBattlefield } from "./GridFunctions.js";
import { blockLanding, checkIfLanded } from "./LandingFunctions.js";

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function gameLost() {
    //if you loose the game everything gets pink
    for (let y = 0; y < 21; y++) {
        await delay(100);
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            field.style.backgroundColor = "#020202"
            field.style.boxShadow = "none";
        }
    }
    await delay(10)

    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            field.style.transition = "background-color 2s ease";
            field.style.backgroundColor = "#01010101";
        }
    }

    //your score
    console.log("Blocks: " + blocks + "\nScore: " + score);
    document.getElementById("score").innerText = score;
    document.getElementById("blocks").innerText = blocks;

}

//move validation for collisions with other blocks
function moveValidation(oldX, oldY, tetromino) {
    let checkCount = 0;
    //loops through each field of tetromino to check background color
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i = 0; i < positionT.length; i++) {
        let yPos = parseInt(positionT[i].slice(1)); // Extrahiere Y-Koordinate aus ID
        if (yPos < 0) {
            // Tetromino ist über der oberen Grenze, Spiel verloren
            gameLost();
            return false;
        }
    }
    for (let i = 0; i < positionT.length; i++) {
        //get the square
        let partOfT = document.getElementById(positionT[i]);
        if (!partOfT) continue;
        //get the computed style
        let computedStyleOfSquare = window.getComputedStyle(partOfT);
        //get the background color
        let backgroundColor = computedStyleOfSquare.backgroundColor;
        if (backgroundColor === "rgba(1, 1, 1, 0.004)") {
            checkCount += 1;
        }
    }
    //returns if move is possible or not
    if (checkCount === positionT.length) {
        return true;
    } else {
        tetromino.shiftX = oldX
        tetromino.shiftY = oldY
        return false;
    }
}

//event listener function for key inputs
function whichKey(activeTetromino, worker, key) {
    if (activeTetromino !== currentActiveTetromino) return;
    //variables for validation
    let oldX = activeTetromino.shiftX;
    let oldY = activeTetromino.shiftY;

    switch (key.key) {
        case "ArrowUp":
            clearBattlefield(activeTetromino);
            let oldPosition = activeTetromino.position;
            activeTetromino.rotate();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
                activeTetromino.position = oldPosition;
            } else {
                console.log("move accepted");
            }
            drawBattlefield(activeTetromino);
            break;

        case "ArrowRight":
            clearBattlefield(activeTetromino);
            if (level !== 3) activeTetromino.shiftXRight();
            else activeTetromino.shiftXLeft();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
            } else {
                console.log("move accepted");
            }
            drawBattlefield(activeTetromino);
            break;
            
        case "ArrowLeft":
            clearBattlefield(activeTetromino);
            if (level !== 3) activeTetromino.shiftXLeft();
            else activeTetromino.shiftXRight();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
            } else {
                console.log("move accepted");
            }
            drawBattlefield(activeTetromino);
            break;

        case "ArrowDown":
            keyCooldown = true;
            worker.postMessage("down"); // Geschwindigkeit erhöhen
            clearBattlefield(activeTetromino);
            activeTetromino.shiftYDown();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
                activeTetromino.shiftX = oldX;
                activeTetromino.shiftY = oldY;
                drawBattlefield(activeTetromino);
                checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
            } else {
                console.log("move accepted");
                drawBattlefield(activeTetromino);
                checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
            }
            setTimeout(() => {
                keyCooldown = false;
                worker.postMessage("reset"); // Geschwindigkeit zurücksetzen nach Ablauf
            }, 40); // Cooldown-Dauer entspricht der schnellen Geschwindigkeit
            break;
        default:
            return;
    }
    
}


// This is an old verision, just for backup
//case "ArrowDown":
//    keyCooldown = true;
//    clearBattlefield(activeTetromino);
//    activeTetromino.shiftYDown();
//    if (!moveValidation(oldX, oldY, activeTetromino)) {
//        console.log("move denied");
//        activeTetromino.shiftX = oldX; // Position zurücksetzen
//        activeTetromino.shiftY = oldY;
//        drawBattlefield(activeTetromino); // Sofort wieder zeichnen
//        checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
//    } else {
//        console.log("move accepted");
//        drawBattlefield(activeTetromino);
//        checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
//    }
//    setTimeout(() => keyCooldown = false, 50); // Entsperre nach 50ms
//    break;
//default:
//    return;
//}

export async function gameLoop() {
    if (blockActive) return;
    blockActive = true;
    if (blocks >= 80) {
        level = 3;
    } else if (blocks >= 40 && level < 3) {
        level = 2;
    }
    //select random tetromino
    switch (level) {
        case 1:
            activeTetromino = nextBlock;
            let levelOneArray = [TTetromino,ITetromino,OTetromino,JTetromino,LTetromino,ZTetromino,STetromino]
            let randomTetrominoOne = levelOneArray[Math.floor(Math.random() * levelOneArray.length)];
            nextBlock = new randomTetrominoOne
            console.log("arrayOne")
            break
        case 2:
            activeTetromino = nextBlock;
            let levelTwoArray = [ITetromino,OTetromino,TTetromino,TTetromino,LTetromino,LTetromino,JTetromino,JTetromino,STetromino,STetromino,ZTetromino,ZTetromino,PlusTetromino,PlusTetromino,UTetromino,UTetromino];
            let randomTetrominoTwo = levelTwoArray[Math.floor(Math.random() * levelTwoArray.length)];
            nextBlock = new randomTetrominoTwo
            console.log("arrayTwo")
            break
        case 3:
            activeTetromino = nextBlock;
            let levelThreeArray = [TTetromino,TTetromino,LTetromino,LTetromino,JTetromino,JTetromino,STetromino,STetromino,ZTetromino,ZTetromino,PlusTetromino,PlusTetromino,PlusTetromino,UTetromino,UTetromino,UTetromino];
            let randomTetrominoThree = levelThreeArray[Math.floor(Math.random() * levelThreeArray.length)];
            nextBlock = new randomTetrominoThree
            console.log("arrayThree")
            break
        default:
            break;
    }
    //create worker
    const worker = new Worker("../public/scripts/moveDown_worker.js");
    worker.postMessage(level);
    currentActiveTetromino = activeTetromino;

    //draws the tetromino for the first time
    drawBattlefield(activeTetromino);
    blocks += 1;
    console.log("Blocks = " + blocks + ", Score = " + score);
    document.getElementById("score").innerText = score;
    document.getElementById("blocks").innerText = blocks;
    document.getElementById("level").innerText = level;

    //receives message from worker to shift down y
    worker.onmessage = function (shiftYDown) {
        if (shiftYDown.data === "shiftYDown" && blockActive) {
            clearBattlefield(activeTetromino);
            let oldX = activeTetromino.shiftX;
            let oldY = activeTetromino.shiftY;
            activeTetromino.shiftYDown();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied")
                blockLanding(activeTetromino, worker, boundWhichKey);
            } else {
                console.log("move accepted")
                drawBattlefield(activeTetromino);
                checkIfLanded(activeTetromino, worker, boundWhichKey);
            }
        }
    }
    //listener for all key inputs relating to the activeTetromino
    const boundWhichKey = whichKey.bind(null, activeTetromino, worker);
    document.addEventListener("keydown", boundWhichKey);
}

const app = document.getElementById("app");
export let blockActive = false;
let keyCooldown = false; // Cooldown für ArrowDown

export let currentActiveTetromino = null;

//create grid for game
createGrid();

//stats
let blocks = 0;
let score = 0;
let level = 1;

//Initialization and declaration of activeTetromino
let activeTetromino;
let startArray = [TTetromino,ITetromino,OTetromino,JTetromino,LTetromino,ZTetromino,STetromino]
let startTetromino = startArray[Math.floor(Math.random() * startArray.length)];
let nextBlock = new startTetromino

//starts game
gameLoop();

//functions for variable access over different files
export function changeScore(value) {
    score += value;
}

export function setBlockActive(value) {
    blockActive = value;
}