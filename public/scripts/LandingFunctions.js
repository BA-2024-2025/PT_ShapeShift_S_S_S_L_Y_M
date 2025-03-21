import { setBlockActive, gameLost, currentActiveTetromino, blockActive, gameLoop } from "./GameFunctions.js";
import { drawBattlefield } from "./GridFunctions.js";
import { applyGravity, checkFullLines, removeLine } from "./LineRemovementFunctions.js";

//resets everything after block reached bottom
export async function blockLanding(tetromino, worker, eventFunction) {
    //remove shadow from the landing block
    if (!blockActive || tetromino !== currentActiveTetromino) return; // Block wurde bereits beendet
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

export function checkIfLanded(activeTetromino, worker, eventFunction) {
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