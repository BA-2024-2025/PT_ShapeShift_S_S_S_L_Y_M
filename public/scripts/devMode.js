// Dev-Modus-Status
let devModeActive = false;
let devModeWorker = null;

// Funktion zum Starten des Dev-Modus
function startDevMode() {
    if (devModeActive) return; // Bereits aktiv
    devModeActive = true;
    console.log("Dev-Modus aktiviert. Wähle Tetrominos mit 1-7. Drücke 'D' zum Beenden.");

    // Aktuellen Worker stoppen, falls vorhanden
    if (blockActive && devModeWorker) {
        devModeWorker.postMessage("stop");
        setTimeout(() => devModeWorker.terminate(), 50);
    }

    // Event-Listener für Dev-Modus hinzufügen
    document.addEventListener("keydown", devModeKeyHandler);
}

// Funktion zum Beenden des Dev-Modus
function stopDevMode() {
    devModeActive = false;
    console.log("Dev-Modus deaktiviert. Normales Spiel wird fortgesetzt.");
    document.removeEventListener("keydown", devModeKeyHandler);

    // Normalen Spielablauf fortsetzen
    if (!blockActive) {
        gameLoop();
    }
}

// Key-Handler für den Dev-Modus
function devModeKeyHandler(event) {
    if (!devModeActive) return;

    switch (event.key) {
        case "d":
        case "D":
            stopDevMode();
            break;
        case "1":
            spawnTetromino(new TTetromino());
            break;
        case "2":
            spawnTetromino(new ITetromino());
            break;
        case "3":
            spawnTetromino(new OTetromino());
            break;
        case "4":
            spawnTetromino(new JTetromino());
            break;
        case "5":
            spawnTetromino(new LTetromino());
            break;
        case "6":
            spawnTetromino(new ZTetromino());
            break;
        case "7":
            spawnTetromino(new STetromino());
            break;
        default:
            return;
    }
}

// Funktion zum Spawnen eines Tetrominos im Dev-Modus
function spawnTetromino(tetromino) {
    if (blockActive) {
        // Alten Tetromino aufräumen
        clearBattlefield(currentActiveTetromino);
        if (devModeWorker) {
            devModeWorker.postMessage("stop");
            setTimeout(() => devModeWorker.terminate(), 50);
        }
        blockActive = false;
    }

    // Neuen Tetromino setzen
    currentActiveTetromino = tetromino;
    blockActive = true;

    // Tetromino zeichnen
    drawBattlefield(currentActiveTetromino);
    console.log("Spawned Tetromino:", tetromino.color);

    // Worker für automatische Bewegung starten
    devModeWorker = new Worker("../public/scripts/moveDown_worker.js");
    devModeWorker.onmessage = function (shiftYDown) {
        if (shiftYDown.data === "shiftYDown" && blockActive && devModeActive) {
            clearBattlefield(currentActiveTetromino);
            let oldX = currentActiveTetromino.shiftX;
            let oldY = currentActiveTetromino.shiftY;
            currentActiveTetromino.shiftYDown();
            if (!moveValidation(oldX, oldY, currentActiveTetromino)) {
                console.log("move denied");
                blockLanding(currentActiveTetromino, devModeWorker, devModeWhichKey);
            } else {
                console.log("move accepted");
                drawBattlefield(currentActiveTetromino);
                checkIfLanded(currentActiveTetromino, devModeWorker, devModeWhichKey);
            }
        }
    };

    // Event-Listener für manuelle Steuerung im Dev-Modus
    const devModeWhichKey = whichKey.bind(null, currentActiveTetromino, devModeWorker);
    document.addEventListener("keydown", devModeWhichKey);
}

// Globaler Listener zum Aktivieren des Dev-Modus
document.addEventListener("keydown", (event) => {
    if (event.key === "d" || event.key === "D") {
        if (!devModeActive) {
            startDevMode();
        }
    }
});