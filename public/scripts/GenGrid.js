import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {ITetromino} from "./ITetromino.js";

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
        partOfT.style.backgroundColor = tetromino.getColor();
        partOfT.style.boxShadow = `inset 3px 3px 0px rgba(255, 255, 255, 0.75), 2px 2px 10px ${tetromino.getColor()}`;
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
            child.style.gridColumn = x + 1;
            child.style.gridRow = y + 1;
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

    //checks if they are on the bottom
    //yellow O
    console.log(activeTetromino.getColor());
    if (activeTetromino.color === "#f5ff00") {
        console.log("yellow")
        if (activeTetromino.getShiftY() === 19) {
            blockLanding(activeTetromino, worker, eventFunction);
        }
    }
    //light blue I
    else if (activeTetromino.color === "#4DFFFF") {
        console.log("lightblue")
        if ((activeTetromino.getPosition() !== activeTetromino.pos2 && activeTetromino.getShiftY() === 19)||(activeTetromino.getPosition() === activeTetromino.pos2 && activeTetromino.getShiftY() === 17)) {
            blockLanding(activeTetromino, worker, eventFunction);
        }
    }
    //purple T
    else if (activeTetromino.color === "#8e27de") {
        console.log("purple")
        if ((activeTetromino.getPosition() !== activeTetromino.pos3 && activeTetromino.getShiftY() === 18)||(activeTetromino.getPosition() === activeTetromino.pos3 && activeTetromino.getShiftY() === 19)) {
            blockLanding(activeTetromino, worker, eventFunction);
        }
    }
    console.log("i dont like you")
}

function gameLoop(activeTetromino) {
     activeTetromino = null;
    //select random tetromino
    let randNum = Math.floor(Math.random() * 3) + 1;
    if (randNum === 1) {
        activeTetromino = new ITetromino();
    } else if (randNum === 2) {
        activeTetromino = new OTetromino();
    } else if (randNum === 3) {
        activeTetromino = new TTetromino();
    }

    //draws the tetromino for the first time
    drawBattlefield(activeTetromino);

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