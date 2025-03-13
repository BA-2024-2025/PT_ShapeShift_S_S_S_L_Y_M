import {TTetromino} from "./TTetromino.js";

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

function drawBattlefield(shape) {
    let positionT = shape.getElementIdGrid(shape.getGridPosition())
    for (let i  = 0; i < 4; i++) {
        let partOfT = document.getElementById(positionT[i])
        partOfT.style.backgroundColor = shape.getColor()
    }
}

let count = 0;
for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 10; x++) {
        const child = document.createElement("div")
        child.id = x + "" + y;
        child.className = "container"
        child.style.gridColumn= x + 1;
        child.style.gridRow= y + 1;
        app.appendChild(child)
        count += 1
    }
}

let t = new TTetromino("blue")
drawBattlefield(t)


//Workers home
let worker;

document.addEventListener("keydown", function(whichKey){
    if (whichKey.key === "T") {
        console.log("t")
        //create worker
        if (typeof(worker) == "undefined") {
            console.log("worker")
            worker = new Worker("./moveDown_worker.js");
        } else {
            console.log("worker is running ...");
        }
    }
    if (whichKey.key === "X") {
        //check for active worker
        if (typeof(worker) == "undefined") {
            console.log("No worker exist, maybe terminated himself")
        } else {
            console.log("Worker is waiting to terminate himself");
        }
    }
    if (whichKey.key === "ArrowUp") {
        clearBattlefield()
        t.rotate();
        drawBattlefield(t)
    }
    if (whichKey.key === "ArrowRight") {
        clearBattlefield()
        t.shiftXRight()
        drawBattlefield(t)

    }
    if (whichKey.key === "ArrowLeft") {
        clearBattlefield()
        t.shiftXLeft()
        drawBattlefield(t)
    }
    if (whichKey.key === "ArrowDown") {
        clearBattlefield()
        t.shiftYDown()
        drawBattlefield(t)
    }
})