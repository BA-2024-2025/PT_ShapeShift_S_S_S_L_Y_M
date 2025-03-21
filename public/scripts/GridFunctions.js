//generating the grid
export function createGrid() {
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

//removes tetromino from grid
export function clearBattlefield(tetromino) {
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

//draws tetromino onto battlefield
export function drawBattlefield(tetromino) {
    //draws the tetromino on the right position
    let positionT = tetromino.getElementIdGrid(tetromino.getGridPosition());
    for (let i = 0; i < positionT.length; i++) {
        let partOfT = document.getElementById(positionT[i]);
        if (partOfT) {
            partOfT.style.backgroundColor = tetromino.color;
            partOfT.style.boxShadow = `inset 3px 3px 0px rgba(255, 255, 255, 0.75), inset -2px -2px 0px rgba(255, 255, 255, 0.75), 2px 2px 10px ${tetromino.color}`;
            // Paper mode:
            // partOfT.style.boxShadow = `inset 3px 3px 50px rgba(255, 255, 255, 0.75), 2px 2px 10px ${tetromino.color}`;

        }
    }
}