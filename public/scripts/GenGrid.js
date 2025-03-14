import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {ITetromino} from "./ITetromino.js";

const app = document.getElementById("app");

function clearBattlefield(tetromino) {

    //Clears the squares where the tetromino was before
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i]);
        partOfT.style.backgroundColor = "black";
    }
}

function drawBattlefield(tetromino) {

    //draws the tetromino on the right position
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i]);
        partOfT.style.backgroundColor = tetromino.getColor();
    }
}

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

//game starts
createGrid();


let blockFalling = false;
let activeTetromino;


//select random tetromino
let randNum = Math.floor(Math.random() * 3) + 1;
if (randNum === 1) {
    activeTetromino = new TTetromino();
} else if (randNum === 2) {
    activeTetromino = new ITetromino();
} else if (randNum === 3) {
    activeTetromino = new OTetromino();
}

//draws the tetromino for the first time
drawBattlefield(activeTetromino);

//create worker
const worker = new Worker("/ShapeShift/public/scripts/moveDown_worker.js");

//receives message from worker to shift down y
worker.onmessage = function(shiftYDown) {
    if (shiftYDown.data === "shiftYDown") {
        clearBattlefield(activeTetromino)
        activeTetromino.shiftYDown()
        drawBattlefield(activeTetromino)

        //kills worker if t reached end
        if (activeTetromino.getShiftY() === 19) {
            worker.terminate();
        }
    }
}

blockFalling = true;

//waiting for block to fall down
//here condition check when block reached bottom


//listener for all key inputs relating to the activeTetromino
document.addEventListener("keydown", function(whichKey){
    if (whichKey.key === "T") {

    }
    if (whichKey.key === "ArrowUp") {
        clearBattlefield(activeTetromino)
        activeTetromino.rotate();
        drawBattlefield(activeTetromino)
    }
    if (whichKey.key === "ArrowRight") {
        clearBattlefield(activeTetromino)
        activeTetromino.shiftXRight()
        drawBattlefield(activeTetromino)

    }
    if (whichKey.key === "ArrowLeft") {
        clearBattlefield(activeTetromino)
        activeTetromino.shiftXLeft()
        drawBattlefield(activeTetromino)
    }
    if (whichKey.key === "ArrowDown") {
        clearBattlefield(activeTetromino)
        activeTetromino.shiftYDown()
        drawBattlefield(activeTetromino)
    }
})