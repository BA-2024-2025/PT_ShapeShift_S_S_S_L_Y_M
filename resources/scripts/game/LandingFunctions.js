import { setBlockActive, gameLost, currentActiveTetromino, blockActive, gameLoop } from "./GameFunctions.js";
import { GhostTetromino } from "./GhostTetromino.js";
import { drawBattlefield } from "./GridFunctions.js";
import { BombTetromino } from "./BombTetromino.js";
import { applyGravity, checkFullLines, removeLine } from "./LineRemovementFunctions.js";
import { delay } from "./GameFunctions.js";
import { TTetromino } from "./TTetromino.js";
import { ensureGrounded } from "./LineRemovementFunctions.js";
import {sendScore} from "./HomeStats.js";
import { LineClearTetromino } from "./LineClearTetromino.js";
import {explosionSound} from "../music-sound.js";

export let counter = 0;

//resets everything after block reached bottom
export async function blockLanding(tetromino, worker, eventFunction) {
    //remove shadow from the landing block
    if (!blockActive || tetromino !== currentActiveTetromino) return; // Block wurde bereits beendet

    if (tetromino instanceof GhostTetromino) {
        counter = 3;
    } else if (tetromino instanceof BombTetromino) {
        if (counter > 0) {
            counter--;
        }
        setBlockActive(false);
        drawBattlefield(tetromino);
        document.removeEventListener("keydown", eventFunction);
        worker.postMessage("reset");
        worker.postMessage("stop");
        worker.terminate();

        console.log("Bomb landed");
        await delay(1000);
        
        // 💣
        await explodeBomb(tetromino);
        await delay(30);
        tetromino.isExploded = true; 
        await applyGravity(checkFullLines(tetromino));
        ensureGrounded();

        if (counter > 0) {
            for (let y = 0; y < 21; y++) {
                for (let x = 0; x < 10; x++) {
                    let field = document.getElementById(x + "" + y);
                    if (field) field.style.opacity = "0.05";
                }
            }
        } else {
            for (let y = 0; y < 21; y++) {
                for (let x = 0; x < 10; x++) {
                    let field = document.getElementById(x + "" + y);
                    if (field) field.style.opacity = "1";
                }
            }
        }
            setTimeout(() => gameLoop(), 100);
            return; 
    } else if (tetromino instanceof LineClearTetromino) {
        if (counter > 0) {
            counter--;
        }
        setBlockActive(false);
        drawBattlefield(tetromino);
        document.removeEventListener("keydown", eventFunction);
        worker.postMessage("reset");
        worker.postMessage("stop");
        worker.terminate();


        let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
        let yPosition = [...new Set(positionT.map(pos => parseInt(pos.slice(1))))]
        await removeLine(yPosition);
        await applyGravity(yPosition);
        await removeLine(yPosition);
        ensureGrounded();

        if (counter > 0) {
            for (let y = 0; y < 21; y++) {
                for (let x = 0; x < 10; x++) {
                    let field = document.getElementById(x + "" + y);
                    if (field) field.style.opacity = "0.05";
                }
            }
        } else {
            for (let y = 0; y < 21; y++) {
                for (let x = 0; x < 10; x++) {
                    let field = document.getElementById(x + "" + y);
                    if (field) field.style.opacity = "1";
                }
            }
        }
        setTimeout(() => gameLoop(), 100);
        return;
    }

    if (counter > 0) {
        counter--;
    }


    setBlockActive(false);
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
        ensureGrounded();
    }

    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i = 0; i < positionT.length; i++) {
        let yPos = parseInt(positionT[i].slice(1)); // Y-Koordinate aus ID
        if (yPos <= 1) { // Wenn irgendein Teil bei oder über der Startlinie liegt
            gameLost();
            return;
        }
    }

    if (counter > 0) {
        for (let y = 0; y < 21; y++) {
            for (let x = 0; x < 10; x++) {
                let field = document.getElementById(x + "" + y);
                if (field) field.style.opacity = "0.05";
            }
        }
    } else {
        for (let y = 0; y < 21; y++) {
            for (let x = 0; x < 10; x++) {
                let field = document.getElementById(x + "" + y);
                if (field) field.style.opacity = "1";
            }
        }
    }

    //restart the game
    console.log(counter);
    setTimeout(() => gameLoop(), 100);
}


async function explodeBomb(tetromino) {
    const positionT = tetromino.getElementIdGrid(tetromino.getGridPosition())
    const affectedLines = new Set();
    const affectedFields = new Set();

    positionT.forEach(pos => {
        const x = parseInt(pos[0]);
        const y = parseInt(pos.slice(1));

        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const newX = x + dx;
                const newY = y + dy;
                if (newX >= 0 && newX < 10 && newY >= 0 && newY < 21) {
                    affectedFields.add(`${newX}${newY}`); // Eindeutige ID als String
                    affectedLines.add(newY); // Für Gravitation
                    }
                }
            }
        });

    let scoreIncrement = 0;
    for (const fieldId of affectedFields) {
        const field = document.getElementById(fieldId);
        if (field) {
            const computedStyle = window.getComputedStyle(field);
            if (computedStyle.backgroundColor !== "rgba(1, 1, 1, 0.004)") {
                field.style.backgroundColor = "#FF4500"; // Explosionsfarbe
                await delay(30);
                scoreIncrement += 1;

            }
            field.style.backgroundColor = "#01010101";
            field.style.boxShadow = "none";
        }
    }
    sendScore(scoreIncrement-4)
    return Array.from(affectedLines).sort((a, b) => b - a); // Rückgabe für applyGravity
}

export async function checkIfLanded(activeTetromino, worker, eventFunction) {
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
            break;
        //black ghost
        case "#000000":
            if ((activeTetromino.position !== activeTetromino.pos3 && activeTetromino.shiftY === 18) || (activeTetromino.position === activeTetromino.pos3 && activeTetromino.shiftY === 19)) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;
        case "#FF0000" || "FEFEFE": // BombTetromino
            if (activeTetromino.shiftY === 19) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;
        case "#cba201": // linecleartetromino
            if (activeTetromino.shiftY === 20) {
                blockLanding(activeTetromino, worker, eventFunction);
            }
            break;
        default:
            return;
    }
}