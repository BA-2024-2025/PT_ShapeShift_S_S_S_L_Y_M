import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {ITetromino} from "./ITetromino.js";

const app = document.getElementById("app")

function clearBattlefield() {

    //Clears the battlefield
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            let grid = document.getElementById(String(x)+String(y));
            grid.style.backgroundColor = "black";
        }
    }
}

function drawBattlefield(tetromino) {

    //draws the tetromino on the right position
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition())
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i])
        partOfT.style.backgroundColor = tetromino.getColor()
    }
}

function createGrid() {

    //simi cooking the grid
    let count = 0;
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            const child = document.createElement("div")
            child.id = x + "" + y;
            child.className = "container"
            child.style.gridColumn = x + 1;
            child.style.gridRow = y + 1;
            app.appendChild(child)
            count += 1
        }
    }
}

createGrid()

let activeTetromino= new ITetromino()
drawBattlefield(activeTetromino)

document.addEventListener("keydown", function(whichKey){
    if (whichKey.key === "T") {

        //create worker
        const worker = new Worker("/ShapeShift/public/scripts/moveDown_worker.js");

        //receives message from worker to shift down y
        worker.onmessage = function(shiftYDown) {
            if (shiftYDown.data === "shiftYDown") {
                clearBattlefield()
                activeTetromino.shiftYDown()
                drawBattlefield(activeTetromino)

                //kills worker if t reached end
                if (activeTetromino.getShiftY() === 19) {
                    worker.terminate();
                }
            }
        }
    }
    if (whichKey.key === "ArrowUp") {
        clearBattlefield()
        activeTetromino.rotate();
        drawBattlefield(activeTetromino)
    }
    if (whichKey.key === "ArrowRight") {
        clearBattlefield()
        activeTetromino.shiftXRight()
        drawBattlefield(activeTetromino)

    }
    if (whichKey.key === "ArrowLeft") {
        clearBattlefield()
        activeTetromino.shiftXLeft()
        drawBattlefield(activeTetromino)
    }
    if (whichKey.key === "ArrowDown") {
        clearBattlefield()
        activeTetromino.shiftYDown()
        drawBattlefield(activeTetromino)
    }
})