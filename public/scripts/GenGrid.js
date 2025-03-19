import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {ITetromino} from "./ITetromino.js";
import {LTetromino} from "./LTetromino.js";
import {JTetromino} from "./JTetromino.js";
import {ZTetromino} from "./ZTetromino.js";
import {STetromino} from "./STetromino.js";
import { PlusTetromino } from "./PlusTetromino.js";
import { UTetromino } from "./UTetromino.js";

const app = document.getElementById("app");

let blockActive = false;

function clearBattlefield(tetromino) {

    //Clears the squares where the tetromino was before
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < positionT.length; i++) {
        let partOfT = document.getElementById(positionT[i]);
        if (partOfT) {
            partOfT.style.backgroundColor = "#01010101";
            partOfT.style.boxShadow = "none";
        }
    }
}

function drawBattlefield(tetromino) {

    //draws the tetromino on the right position
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < positionT.length; i++) {
        let partOfT = document.getElementById(positionT[i]);
        if (partOfT) {
            partOfT.style.backgroundColor = tetromino.color;
            partOfT.style.boxShadow = `inset 3px 3px 0px rgba(255, 255, 255, 0.75), 2px 2px 10px ${tetromino.color}`;
        }

    }
}

//generating the grid
function createGrid() {

    //simi cooking the grid
    let count = 0;
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            const child = document.createElement("div");
            child.id = x + "" + y;
            child.className = "container";
            child.style.gridColumn = x+1;
            child.style.gridRow = y+1;
            child.style.backgroundColor = "#01010101";
            app.appendChild(child);
            count += 1;
        }
    }
}

let currentActiveTetromino = null;

//resets everything after block reached bottom
async function blockLanding(tetromino, worker, eventFunction) {
    //remove shadow from the landing block
    if (!blockActive || tetromino !== currentActiveTetromino) return; // Block wurde bereits beendet
    blockActive = false;
    
    clearBattlefield(tetromino);
    drawBattlefield(tetromino);
    console.log("reached the end");

    // Event-Listener entfernen
    document.removeEventListener("keydown", eventFunction);

    // worker stopen
    worker.postMessage("stop");
    setTimeout(() => worker.terminate(), 50);
    //function to remove full lines from the Grid
    removeLine();

    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i = 0; i < positionT.length; i++) {
        let yPos = parseInt(positionT[i].slice(1)); // Y-Koordinate aus ID
        if (yPos <= 1) { // Wenn irgendein Teil bei oder über der Startlinie liegt
            gameLost();
            return;
        }
    }

    //restart the game
   setTimeout(() => gameLoop(), 100);
}

function gameLost() {

    //if you loose the game everything gets pink
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x+""+y);
            field.style.backgroundColor = "#ff10f0";
        }
    }

    //your score
    console.log("Blocks: " + blocks + "\nScore: " + score);


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

    for (let i  = 0; i < positionT.length; i++) {

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
    if (checkCount === positionT.length){
        return true;
    } else {
        tetromino.shiftX = oldX
        tetromino.shiftY = oldY
        return false;
    }
}

let keydownLocked;
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
            activeTetromino.shiftXRight();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
            } else {
                console.log("move accepted");
            }
            drawBattlefield(activeTetromino);
            break;

        case "ArrowLeft":
            clearBattlefield(activeTetromino);
            activeTetromino.shiftXLeft();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied");
            } else {
                console.log("move accepted");
            }
            drawBattlefield(activeTetromino);
            break;

        case "ArrowDown":
            clearBattlefield(activeTetromino);
            activeTetromino.shiftYDown();
            if (!moveValidation(oldX, oldY, activeTetromino)) {
                console.log("move denied")
                checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
            } else {
                console.log("move accepted")
                drawBattlefield(activeTetromino);
                checkIfLanded(activeTetromino, worker, whichKey.bind(null, activeTetromino, worker));
            }
            break;

        default:
            return;
    }
}

function checkIfLanded(activeTetromino, worker, eventFunction) {
    if (activeTetromino !== currentActiveTetromino) return;

    switch (activeTetromino.color) {

        //checks if they are on the bottom
        //yellow O
        case "#f5ff00":
            if (activeTetromino.shiftY === 19) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //light blue I
        case "#4DFFFF":
            if ((activeTetromino.position !== activeTetromino.pos2 && activeTetromino.shiftY === 19) || (activeTetromino.position === activeTetromino.pos2 && activeTetromino.shiftY === 17)) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //purple T
        case "#8e27de":
            if ((activeTetromino.position !== activeTetromino.pos3 && activeTetromino.shiftY === 18) || (activeTetromino.position === activeTetromino.pos3 && activeTetromino.shiftY === 19)) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //orange L
        case "#FF5C00":
            if ((activeTetromino.position !== activeTetromino.pos4 && activeTetromino.shiftY === 18) || (activeTetromino.position === activeTetromino.pos4 && activeTetromino.shiftY === 19)) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //blue J
        case "#2323FF":
            if ((activeTetromino.position !== activeTetromino.pos2 && activeTetromino.shiftY === 18) || (activeTetromino.position === activeTetromino.pos2 && activeTetromino.shiftY === 19)) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //red Z
        case "#FC1723":
            if (activeTetromino.shiftY === 18) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;

        //green S
        case "#00F700":
            if (activeTetromino.shiftY === 18) {
                blockLanding(activeTetromino, worker, eventFunction);
            }

        default:
            return;
    }
}

function removeLine() {
    let linesRemoved = 0;

    //loops through each line of the gird
    for (let y = 20; y >= 0; y--) {

        let countOfColored = 0;

        //selects each field from the line
        for (let x = 0; x < 10; x++) {

            //selects the field
            let field = document.getElementById(x+""+y);

            //get the computed style
            let computedStyleOfField = window.getComputedStyle(field);

            //get the background color
            let fieldBackground = computedStyleOfField.backgroundColor;

            if (fieldBackground !== "rgba(1, 1, 1, 0.004)") {
                countOfColored++;
            }
        }

        //removes the colored line
        if (countOfColored === 10) {
            //selects each field from the line
            for (let x = 0; x < 10; x++) {
                let coloredField = document.getElementById(x+""+y);
                coloredField.style.backgroundColor = "#01010101";
                coloredField.style.boxShadow = "none";
            }
            linesRemoved++;
            score += 10;

            //function for gravity
            gravity();

            //stop the loop when the gravity needs to pull the blocks one down
            y++;
        }
    }

    if (linesRemoved > 1) {
        score += (linesRemoved -1) * 20;
    }
}

function gravity() {
    for (let y = 20; y > 0; y--) {
        for (let x = 0; x < 10; x++) {
            let currentField = document.getElementById(x+""+y);
            let fieldAbove = document.getElementById(x+""+(y-1));

            // style from the block above
            let computedStyleAbove = window.getComputedStyle(fieldAbove);
            let backgroundColorAbove = computedStyleAbove.backgroundColor;
            let boxShadowAbove = computedStyleAbove.boxShadow;

            // drop the field above down, if not empty
            if (backgroundColorAbove !== "rgba(1, 1, 1, 0.004)") {
                currentField.style.backgroundColor = backgroundColorAbove;
                currentField.style.boxShadow = boxShadowAbove;

                // delete field above
                fieldAbove.style.backgroundColor = "#01010101";
                fieldAbove.style.boxShadow = "none";
            }
        }
    }
}

async function gameLoop() {
    if (blockActive) return;
    blockActive = true;

    //select random tetromino
    let activeTetromino;
    let randNum = Math.floor(Math.random() * 9) + 1;
    if (randNum === 1) {
        activeTetromino = new TTetromino();
    } else if (randNum === 2) {
        activeTetromino = new ITetromino();
    } else if (randNum === 3) {
        activeTetromino = new OTetromino();
    } else if (randNum === 4) {
        activeTetromino = new JTetromino();
    } else if (randNum === 5) {
        activeTetromino = new LTetromino();
    } else if (randNum === 6) {
        activeTetromino = new ZTetromino();
    } else if (randNum === 7) {
        activeTetromino = new STetromino();
    } else if (randNum === 8) {
        activeTetromino = new PlusTetromino();
    } else if (randNum == 9) {
        activeTetromino = new UTetromino();
    }

    currentActiveTetromino = activeTetromino;
    
    //draws the tetromino for the first time
    drawBattlefield(activeTetromino);
    blocks += 1;
    console.log("Blocks = " + blocks + ", Score = " + score);

    //create worker
    const worker = new Worker("../public/scripts/moveDown_worker.js");

    //receives message from worker to shift down y
    worker.onmessage = function (shiftYDown) {
        if (shiftYDown.data === "shiftYDown" && blockActive) {
            clearBattlefield(activeTetromino);
            let oldX= activeTetromino.shiftX;
            let oldY= activeTetromino.shiftY;
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

//game starts
createGrid();

//stats
let blocks = 0;
let score = 0;
gameLoop();

/*Der Bug das ganz viele spawnen wenn ich die down taste drücken hängt damit zusammen
das der listener nicht genügend schnell gelöscht wird und somit wird immer ein neues
gespawnt da der untere block immernoch zählt für die Bedingung*/