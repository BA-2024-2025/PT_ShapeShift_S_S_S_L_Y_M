import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {ITetromino} from "./ITetromino.js";
import {LTetromino} from "./LTetromino.js";
import {JTetromino} from "./JTetromino.js";
import {ZTetromino} from "./ZTetromino.js";
import {STetromino} from "./STetromino.js";

const app = document.getElementById("app");

function clearBattlefield(tetromino) {

    //Clears the squares where the tetromino was before
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i]);
        partOfT.style.backgroundColor = "#01010101";
        partOfT.style.boxShadow = "none";

    }
}

function drawBattlefield(tetromino) {

    //draws the tetromino on the right position
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i]);
        partOfT.style.backgroundColor = tetromino.color;
        partOfT.style.boxShadow = `inset 3px 3px 0px rgba(255, 255, 255, 0.75), 2px 2px 10px ${tetromino.color}`;
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
            app.appendChild(child);
            count += 1;
        }
    }
}

//resets everything after block reached bottom
function blockLanding(tetromino, worker, event) {
    //remove shadow from the landing block
    clearBattlefield(tetromino);
    drawBattlefield(tetromino);
    console.log("reached the end");
    document.removeEventListener("keydown", event);
    worker.terminate();

    //restart the game
    gameLoop();
}

//event listener function for key inputs
function whichKey(activeTetromino, worker, variableOfEventFunction, key) {
    switch (key.key) {

        case "ArrowUp":
            clearBattlefield(activeTetromino);
            activeTetromino.rotate();
            drawBattlefield(activeTetromino);
            break;

        case "ArrowRight":
            clearBattlefield(activeTetromino);
            activeTetromino.shiftXRight();
            drawBattlefield(activeTetromino);
            break;

        case "ArrowLeft":
            clearBattlefield(activeTetromino);
            activeTetromino.shiftXLeft();
            drawBattlefield(activeTetromino);
            break;

        case "ArrowDown":
            clearBattlefield(activeTetromino);
            activeTetromino.shiftYDown();
            drawBattlefield(activeTetromino);
            checkIfLanded(activeTetromino, worker, variableOfEventFunction);
            break;

        default:
            return;
    }
}

function checkIfLanded(activeTetromino, worker, eventFunction) {

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
            if ((activeTetromino.position !== activeTetromino.pos2 && activeTetromino.shiftY === 19) || (activeTetromino.position === activeTetromino.pos2 && activeTetromino.shiftY() === 17)) {
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

function gameLoop(activeTetromino) {
     activeTetromino = null;

     //stats
     let blocks = 0;
     let score = 0;

    //select random tetromino
    let randNum = Math.floor(Math.random() * 7) + 1;
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
    }

    //draws the tetromino for the first time
    drawBattlefield(activeTetromino);
    blocks += 1;

    //create worker
    const worker = new Worker("/ShapeShift/public/scripts/moveDown_worker.js");

    //receives message from worker to shift down y
    worker.onmessage = function(shiftYDown) {
        if (shiftYDown.data === "shiftYDown") {
            clearBattlefield(activeTetromino);
            activeTetromino.shiftYDown();
            drawBattlefield(activeTetromino);
            checkIfLanded(activeTetromino, worker, boundWhichKey);
        }
    }

    //listener for all key inputs relating to the activeTetromino
    let boundWhichKey;
    boundWhichKey= whichKey.bind(null, activeTetromino, worker, boundWhichKey);
    document.addEventListener("keydown", boundWhichKey);
}

//game starts
createGrid();
let activeTetromino = new OTetromino();
gameLoop(activeTetromino);


/*Der Bug das ganz viele spawnen wenn ich die down taste drücken hängt damit zusammen
das der listener nicht genügend schnell gelöscht wird und somit wird immer ein neues
gespawnt da der untere block immernoch zählt für die Bedingung*/