import { TTetromino } from "./TTetromino.js";
import { OTetromino } from "./OTetromino.js";
import { ITetromino } from "./ITetromino.js";
import { LTetromino } from "./LTetromino.js";
import { JTetromino } from "./JTetromino.js";
import { ZTetromino } from "./ZTetromino.js";
import { STetromino } from "./STetromino.js";
import { PlusTetromino } from "./PlusTetromino.js";
import { UTetromino } from "./UTetromino.js";
const app = document.getElementById("app");
let blockActive = false;
let keyCooldown = false; // Cooldown für ArrowDown

function clearBattlefield(tetromino) {
    //Clears the squares where the tetromino was before
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i = 0; i < positionT.length; i++) {
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
    for (let i = 0; i < positionT.length; i++) {
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
            child.style.gridColumn = x + 1;
            child.style.gridRow = y + 1;
            child.style.backgroundColor = "#01010101";
            child.style.opacity = "1"; // Standard-Opacity
            app.appendChild(child);
            count += 1;
        }
    }
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let currentActiveTetromino = null;
//resets everything after block reached bottom
async function blockLanding(tetromino, worker, eventFunction) {
    //remove shadow from the landing block
    if (!blockActive || tetromino !== currentActiveTetromino) return; // Block wurde bereits beendet
    blockActive = false;
    //clearBattlefield(tetromino);
    drawBattlefield(tetromino);
    console.log("reached the end");
    // Event-Listener entfernen
    document.removeEventListener("keydown", eventFunction);
    // worker stopen
    await worker.postMessage("reset");
    await worker.postMessage("stop");
    await worker.terminate();
    //function to remove full lines from the Grid
    // Entferne volle Linien und wende Gravitation an

    let linesToRemove = checkFullLines(tetromino);
    if (linesToRemove.length > 0) {
        console.log("\n\n\n\n\n\n\n\n\n\n\n" + "pre Removed" + linesToRemove)
        await removeLine(linesToRemove);
        console.log("\n\n\n\n\n\n\n\n\n\n\n" + "Removed lines to remove" + linesToRemove);
        await applyGravity(linesToRemove);
    }

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
function checkFullLines(tetromino) {
    let linesToRemoveArray = [];
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    let yPosition = [...new Set(positionT.map(pos => parseInt(pos.slice(1))))]
    for (let y of yPosition) {
        let countOfColored = 0;
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            let computedStyleOfField = window.getComputedStyle(field);
            let fieldBackground = computedStyleOfField.backgroundColor;
            if (fieldBackground !== "rgba(1, 1, 1, 0.004)") {
                countOfColored++;
            }
        }
        if (countOfColored === 10) {
            linesToRemoveArray.push(y);
        }
    }
    for (let y = 20; y >= 0; y--) {
        if (yPosition.includes(y)) continue;
        let countOfColored = 0;
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            let computedStyleOfField = window.getComputedStyle(field);
            let fieldBackground = computedStyleOfField.backgroundColor;
            if (fieldBackground !== "rgba(1, 1, 1, 0.004)") {
                countOfColored++;
            }
        }
        if (countOfColored === 10) {
            linesToRemoveArray.push(y);
        }
    }
    return linesToRemoveArray.sort((a, b) => b - a);
}
function gameLost() {
    //if you loose the game everything gets pink
    for (let y = 0; y < 21; y++) {
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            field.style.backgroundColor = "#ff10f0";
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
async function removeLine(linesToRemove) {
    let linesRemoved = linesToRemove.length;
    console.log(linesToRemove)

    for (let y of linesToRemove) {
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            if (field && linesRemoved < 4) {
                // Animationseffekt: Feld unsichtbar machen
                field.style.opacity = "0"; // Unsichtbar machen
                await delay(50); // 50ms Verzögerung zwischen den Feldern
            } else if (field && linesRemoved >= 4) {
                field.style.opacity = "0"; // Unsichtbar machen
                await delay(20); // 50ms Verzögerung zwischen den Feldern
            }
        }

        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            field.style.backgroundColor = "#01010101";
            field.style.boxShadow = "none";
            await delay(10);
            field.style.opacity = "1";
            if (linesRemoved < 4) {
                await delay(50); // Opacity zurücksetzen für spätere Nutzung
            } else if (linesRemoved >= 4) {
                await delay(20); // Opacity zurücksetzen für spätere Nutzung
            }
           
        }
    }
    score += linesRemoved * 10;
    if (linesRemoved > 3) {
        score += (linesRemoved) * 40;
    }
    document.getElementById("score").innerText = score;
    document.getElementById("blocks").innerText = blocks;
}
function applyGravity(linesToRemove) {
    let minY = Math.min(...linesToRemove); // Oberste gelöschte Zeile
    for (let y = 20; y >= 0; y--) {
        if (linesToRemove.includes(y)) continue; // Überspringe gelöschte Zeilen
        let shiftAmount = linesToRemove.filter(line => line > y).length; // Wie viele Zeilen darunter gelöscht wurden
        if (shiftAmount > 0) {
            for (let x = 0; x < 10; x++) {
                let sourceField = document.getElementById(x + "" + y);
                let targetField = document.getElementById(x + "" + (y + shiftAmount));
                if (sourceField && targetField) {
                    let sourceStyle = window.getComputedStyle(sourceField);
                    let sourceBackground = sourceStyle.backgroundColor;
                    let sourceShadow = sourceStyle.boxShadow;
                    if (sourceBackground !== "rgba(1, 1, 1, 0.004)") {
                        targetField.style.backgroundColor = sourceBackground;
                        targetField.style.boxShadow = sourceShadow;
                    }
                    if (y < minY) { // Nur oberhalb der gelöschten Zeilen löschen
                        sourceField.style.backgroundColor = "#01010101";
                        sourceField.style.boxShadow = "none";
                    }
                }
            }
        }
    }
}
async function gameLoop() {
    if (blockActive) return;
    blockActive = true;
    if (blocks >= 80) {
        level = 3;
    } else if (blocks >= 40 && level < 3) {
        level = 2;
    }
    //select random tetromino
    let activeTetromino;
    let randNum
    switch (level) {
        case 1:
            randNum = Math.floor(Math.random() * 9) + 1;
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
            break
        case 2:
            randNum = Math.floor(Math.random() * 20) + 1;
            if (randNum === 1 || randNum === 2 || randNum === 3 || randNum === 4 || randNum === 5) {
                activeTetromino = new TTetromino();
            } else if (randNum === 6 || randNum === 7) {
                activeTetromino = new ITetromino();
            } else if (randNum === 9 || randNum === 8) {
                activeTetromino = new OTetromino();
            } else if (randNum === 10 || randNum === 11) {
                activeTetromino = new JTetromino();
            } else if (randNum === 12 || randNum === 13 || randNum === 14) {
                activeTetromino = new LTetromino();
            } else if (randNum === 15 || randNum === 16 || randNum === 17) {
                activeTetromino = new ZTetromino();
            } else if (randNum === 18 || randNum === 19 || randNum === 20) {
                activeTetromino = new STetromino();
            }
            break
        case 3:
            randNum = Math.floor(Math.random() * 8) + 1;
            if (randNum === 1 || randNum === 2) {
                activeTetromino = new TTetromino();
            } else if (randNum === 3) {
                activeTetromino = new LTetromino();
            } else if (randNum === 4) {
                activeTetromino = new JTetromino();
            } else if (randNum === 5 || randNum === 6) {
                activeTetromino = new STetromino();
            } else if (randNum === 7 || randNum === 8) {
                activeTetromino = new STetromino();
            }
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
//game starts
createGrid();
//stats
let blocks = 0;
let score = 0;
let level = 1;
gameLoop();
/*Der Bug das ganz viele spawnen wenn ich die down taste drücken hängt damit zusammen
das der listener nicht genügend schnell gelöscht wird und somit wird immer ein neues
gespawnt da der untere block immernoch zählt für die Bedingung*/
