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
import { resetScore, sendBlocks, sendScore, resetBlocks, getScore } from "./HomeStats.js"
import { changeNextBlockImage } from "./HomeStats.js"
import { sendRun } from "./index.js";

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function gameLost() {
    await delay(1000);
    startPhysicsSimulation();
}

async function startPhysicsSimulation() {
    const {Engine, Render, Runner, World, Bodies, Body} = Matter;
 
    const engine = Engine.create();
 
    const render = Render.create({
        element: document.getElementById("app"),
        engine: engine,
        options: {
            width: 250,
            height: 525,
            wireframes: false,
            background: "#01010101"
        }
    });
 
    const blocksToFall = [];
    const centerX = 125;
    const centerY = 400;
 
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            const field = document.getElementById(x+""+y);
            const computedStyle = window.getComputedStyle(field);
            const backgroundColor = computedStyle.backgroundColor;
 
            if (backgroundColor !== "rgba(1, 1, 1, 0.004)") {
                const block = Bodies.rectangle(
                    x*25+12,
                    y*25+12,
                    20,
                    20,
                    {
                        restitution: 0.3,
                        friction: 0.1,
                        render: {
                            fillStyle: backgroundColor,
                            strokeStyle: "rgba(255, 255, 255, 0.85)",
                            lineWidth: 5
                        }
                    }
                );
                blocksToFall.push(block);
 
                field.style.backgroundColor = "#01010101";
                field.style.boxShadow = "none";
                field.style.opacity = "1";
            }
        }
    }
 
    World.add(engine.world, blocksToFall);
 
    blocksToFall.forEach(block => {
        const dx = block.position.x - centerX;
        const dy = block.position.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceMagnitude = 0.02;
 
        if (distance > 0) {
            const forceX = (dx / distance) * forceMagnitude;
            const forceY = (dy / distance) * forceMagnitude;
            Body.applyForce(block, block.position, {x: forceX, y: forceY});
            Body.setAngularVelocity(block, Math.random() * 0.1 - 0.05)
        }
    });
 
    const runner = Runner.create();
    Runner.run(runner, engine);
 
    Render.run(render);
 
    setTimeout(() => {
        Runner.stop(runner);
        Render.stop(render);
        World.clear(engine.world);
        Engine.clear(engine);
        render.canvas.remove();
        level = 1;
    }, 5000)
    await delay(2000)

    //send run to api
    sendRun(level);

    //generate new next block so we don't get one from a higher level
    let endLevelOneArray = [TTetromino,ITetromino,OTetromino,JTetromino,LTetromino,ZTetromino,STetromino]
    let endRandomTetrominoOne = endLevelOneArray[Math.floor(Math.random() * endLevelOneArray.length)];
    nextImage = endRandomTetrominoOne
    nextBlock = new endRandomTetrominoOne

    resetBlocks();
    resetScore();
    blocks = 0;
    gameLoop();
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
            nextImage = randomTetrominoOne
            nextBlock = new randomTetrominoOne
            console.log("arrayOne")
            break
        case 2:
            activeTetromino = nextBlock;
            let levelTwoArray = [ITetromino,OTetromino,TTetromino,TTetromino,LTetromino,LTetromino,JTetromino,JTetromino,STetromino,STetromino,ZTetromino,ZTetromino,PlusTetromino,PlusTetromino,UTetromino,UTetromino];
            let randomTetrominoTwo = levelTwoArray[Math.floor(Math.random() * levelTwoArray.length)];
            nextImage = randomTetrominoTwo
            nextBlock = new randomTetrominoTwo
            console.log("arrayTwo")
            break
        case 3:
            activeTetromino = nextBlock;
            let levelThreeArray = [TTetromino,TTetromino,LTetromino,LTetromino,JTetromino,JTetromino,STetromino,STetromino,ZTetromino,ZTetromino,PlusTetromino,PlusTetromino,PlusTetromino,UTetromino,UTetromino,UTetromino];
            let randomTetrominoThree = levelThreeArray[Math.floor(Math.random() * levelThreeArray.length)];
            nextImage = randomTetrominoThree
            nextBlock = new randomTetrominoThree
            console.log("arrayThree")
            break
        default:
            break;
    }

    changeNextBlockImage(String(nextImage))

    //create worker
    const worker = new Worker("../public/scripts/moveDown_worker.js");
    worker.postMessage(level);
    currentActiveTetromino = activeTetromino;

    //draws the tetromino for the first time
    drawBattlefield(activeTetromino);
    sendBlocks(1);
    blocks += 1;

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
let level = 1;
let blocks = 0;
sendScore(0)
sendBlocks(0)

//Initialization and declaration of activeTetromino
let activeTetromino;
let startArray = [TTetromino,ITetromino,OTetromino,JTetromino,LTetromino,ZTetromino,STetromino]
let startTetromino = startArray[Math.floor(Math.random() * startArray.length)];
let nextBlock = new startTetromino
let nextImage = startTetromino

//starts game
gameLoop();

//functions for variable access over different files
export function setBlockActive(value) {
    blockActive = value;
}