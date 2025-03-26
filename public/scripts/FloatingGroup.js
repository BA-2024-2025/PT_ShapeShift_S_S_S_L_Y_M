import { Tetromino } from "./Tetromino.js";

export class FloatingGroup extends Tetromino {
    constructor(positions, colors, shadows) {
        super();
        this.position = positions; // Array von [x, y]-Koordinaten
        this.colors = colors; // Array von Hintergrundfarben
        this.shadows = shadows; // Array von Box-Shadows
        this.shiftX = 0; // Relativ zur Gruppe, meist 0
        this.shiftY = Math.min(...positions.map(pos => pos[1])); // Start-Y ist der höchste Punkt
        this.isGrounded = false;
    }

    shiftYDown() {
        if (!this.isGrounded) {
            this.shiftY += 1;
        }
    }

    checkCollision(grid) {
        const gridPos = this.getGridPosition();
        for (let i = 0; i < gridPos.length; i++) {
            const [x, y] = gridPos[i];
            if (y > 20) return true; // Boden erreicht
            if (x < 0 || x >= 10) return true; // Außerhalb der Breite
            const field = document.getElementById(x + "" + y);
            if (field) {
                const style = window.getComputedStyle(field);
                if (style.backgroundColor !== "rgba(1, 1, 1, 0.004)" && !gridPos.some(pos => pos[0] === x && pos[1] === y)) {
                    return true; // Kollision mit anderem Block
                }
            }
        }
        return false;
    }

    draw() {
        const gridPos = this.getGridPosition();
        for (let i = 0; i < gridPos.length; i++) {
            const [x, y] = gridPos[i];
            if (y >= 0 && y <= 20 && x >= 0 && x < 10) {
                const field = document.getElementById(x + "" + y);
                field.style.backgroundColor = this.colors[i];
                field.style.boxShadow = this.shadows[i];
            }
        }
    }

    clear() {
        const gridPos = this.getGridPosition();
        for (const [x, y] of gridPos) {
            if (y >= 0 && y <= 20 && x >= 0 && x < 10) {
                const field = document.getElementById(x + "" + y);
                field.style.backgroundColor = "#01010101";
                field.style.boxShadow = "none";
            }
        }
    }
}