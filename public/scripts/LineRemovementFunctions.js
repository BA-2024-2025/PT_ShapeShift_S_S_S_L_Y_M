import { changeScore, delay, removeLineWaiter, setRemoveLineWaiter } from "./GameFunctions.js";


export function checkFullLines(tetromino) {
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

export async function removeLine(linesToRemove) {
    setRemoveLineWaiter(true);
    let linesRemoved = linesToRemove.length;
    console.log(linesToRemove)

    for (let y of linesToRemove) {
        for (let x = 0; x < 10; x++) {
            let field = document.getElementById(x + "" + y);
            if (field && linesRemoved < 4) {
                // Animationseffekt: Feld unsichtbar machen
                field.style.opacity = "0"; // Unsichtbar machen
                await delay(30); // 50ms Verzögerung zwischen den Feldern
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
                await delay(20); // Opacity zurücksetzen für spätere Nutzung
            } else if (linesRemoved >= 4) {
                await delay(20); // Opacity zurücksetzen für spätere Nutzung
            }

        }
    }

    //modify score
    let score = 0;
    score += linesRemoved * 10;
    if (linesRemoved > 3) {
        score += (linesRemoved) * 40;
    }
    changeScore(score);

    document.getElementById("score").innerText = score;
    document.getElementById("blocks").innerText = blocks;
}

export function ensureGrounded() {
    let lowestY = -1; 

    for (let y = 0; y <= 20; y++) {
        for (let x = 0; x < 10; x++) {
            const field = document.getElementById(x + "" + y);
            const computedStyle = window.getComputedStyle(field);
            const backgroundColor = computedStyle.backgroundColor;
            if (backgroundColor !== "rgba(1, 1, 1, 0.004)") {
                lowestY = y;
            }
        }
    }
    if (lowestY === -1) {
        return;
    }
    
    if (lowestY === 20) {
        return;
    }

    const shiftAmount = 20 - lowestY;
    for (let y = 20; y >= 0; y--) {
        for (let x = 0; x < 10; x++) {
            const sourceField = document.getElementById(x + "" + y);
            const targetY = y + shiftAmount;
            const sourceStyle = window.getComputedStyle(sourceField);
            const sourceBackground = sourceStyle.backgroundColor;
            const sourceShadow = sourceStyle.boxShadow;

            if (targetY <= 20) {
                const targetField = document.getElementById(x + "" + targetY);
                if (sourceBackground !== "rgba(1, 1, 1, 0.004)") {
                    targetField.style.backgroundColor = sourceBackground;
                    targetField.style.boxShadow = sourceShadow;
                } else {
                    targetField.style.backgroundColor = "#01010101";
                    targetField.style.boxShadow = "none";
                }
            }

            if (y !== targetY && sourceBackground !== "rgba(1, 1, 1, 0.004)") {
                sourceField.style.backgroundColor = "#01010101";
                sourceField.style.boxShadow = "none";
            }
        }
    }
}

export function applyGravity(linesToRemove) {
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

export async function dropFloatingBlocks() {
    const grid = [];
    for (let y = 0; y <= 20; y++) {
        grid[y] = [];
        for (let x = 0; x < 10; x++) {
            const field = document.getElementById(x + "" + y);
            const computedStyle = window.getComputedStyle(field);
            grid[y][x] = computedStyle.backgroundColor === "rgba(1, 1, 1, 0.004)" ? null : {
                backgroundColor: computedStyle.backgroundColor,
                boxShadow: computedStyle.boxShadow
            };
        }
    }

    // ground
    const connectedToGround = new Set();
    function markConnected(x, y) {
        if (x < 0 || x >= 10 || y < 0 || y > 20 || !grid[y][x] || connectedToGround.has(`${x},${y}`)) {
            return;
        }
        connectedToGround.add(`${x},${y}`);
        markConnected(x, y - 1); // oben
        markConnected(x, y + 1); // unten
        markConnected(x - 1, y); // links
        markConnected(x + 1, y); // rechts
    }

    // Starte von allen Bodenblöcken (y=20)
    for (let x = 0; x < 10; x++) {
        if (grid[20][x]) {
            markConnected(x, 20);
        }
    }

    // Finde alle zusammenhängenden Gruppen
    const visited = new Set();
    const groups = [];
    function findGroup(x, y, group) {
        if (x < 0 || x >= 10 || y < 0 || y > 20 || !grid[y][x] || visited.has(`${x},${y}`)) {
            return;
        }
        visited.add(`${x},${y}`);
        group.push({ x, y });
        findGroup(x, y - 1, group); // oben
        findGroup(x, y + 1, group); // unten
        findGroup(x - 1, y, group); // links
        findGroup(x + 1, y, group); // rechts
    }

    // Identifiziere alle Gruppen
    for (let y = 0; y <= 20; y++) {
        for (let x = 0; x < 10; x++) {
            if (grid[y][x] && !visited.has(`${x},${y}`)) {
                const group = [];
                findGroup(x, y, group);
                groups.push(group);
            }
        }
    }

    let moved;
    do {
        moved = false;
        
        for (const group of groups) {
            let isGroupConnected = false;
            for (const { x, y } of group) {
                if (connectedToGround.has(`${x},${y}`)) {
                    isGroupConnected = true;
                    break;
                }
            }

            if (isGroupConnected) continue;

            let lowestY = 0;
            for (const { y } of group) {
                lowestY = Math.max(lowestY, y)
            }

            let canFall = true;
            let fallDistance = 0;
            while (canFall && lowestY + fallDistance < 20) {
                fallDistance++;
                for (const { x, y } of group) {
                    const newY = y + fallDistance;
                    if (newY > 20 || (grid[newY][x] && !group.some(block => block.x === x && block.y === y))) {
                        canFall = false;
                        fallDistance--;
                        break;
                    }
                    if (connectedToGround.has(`${x},${newY}`)) {
                        canFall = false;
                        fallDistance--;
                        break;
                    }
                }
            }

            if (fallDistance > 0) {
                moved = true;
                const newGroupPositions = [];
                for (const { x, y } of group) {
                    const field = document.getElementById(x + "" + y);
                    const backgroundColor = field.style.backgroundColor || "#FFFFFF"; // Fallback-Farbe
                    const boxShadow = field.style.boxShadow || "none"; // Fallback-Schatten
                    grid[y][x] = null;
                    const newY = y + fallDistance;
                    newGroupPositions.push({x, y: newY});
                    grid[newY][x] = {
                        backgroundColor:backgroundColor,
                        boxShadow: boxShadow
                    };
                }

                for (const { x, y } of group) {
                    const field = document.getElementById(x+"" + y);
                    field.style.backgroundColor = "#01010101";
                    field.style.boxShadow = "none";
                }
                
                for (const { x, y } of newGroupPositions) {
                    const field = document.getElementById(x + "" + y);
                    if (grid[y][x]) {
                        field.style.backgroundColor = grid[y][x].backgroundColor || "#FFFFFF";
                        field.style.boxShadow = grid[y][x].boxShadow || "none";
                    } else {
                        field.style.backgroundColor = "#01010101";
                    field.style.boxShadow = "none";
                    }
                    
                }
                group.length = 0;
                group.push(...newGroupPositions);

                await delay(100); // Sanfte Animation
            }
        }

        // Aktualisiere connectedToGround für neu gefallene Gruppen
        for (const group of groups) {
            let isGroupConnected = false;
            for (const { x, y } of group) {
                if (connectedToGround.has(`${x},${y}`)) {
                    isGroupConnected = true;
                    break;
                }
            }
            if (!isGroupConnected) {
                for (const { x, y } of group) {
                    if (y === 20 || connectedToGround.has(`${x},${y + 1}`)) {
                        markConnected(x, y);
                        break;
                    }
                }
            }
        }
    } while (moved);
}

function isStable(x, y, grid) {
    if (y === 20) return true;

    const neighbors = [
        { dx: 0, dy: -1 }, 
        { dx: 0, dy: 1 },  
        { dx: -1, dy: 0 }, 
        { dx: 1, dy: 0 }   
    ];

    for (const { dx, dy } of neighbors) {
        const newX = x + dx;
        const newY = y + dy;
        if (newX >= 0 && newX < 10 && newY >= 0 && newY <= 20) {
            if (grid[newY][newX]) {
                return true;
            }
        }
    }

    return false;
}