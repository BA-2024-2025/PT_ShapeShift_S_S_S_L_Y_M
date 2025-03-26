import { Tetromino } from "./Tetromino.js";

export class BombTetromino extends Tetromino {
    constructor() {
        super();

        // 2x2 Position (wie OTetromino)
        this.pos1 = [
            [0, 0],
            [1, 0],
            [0, 1],
            [1, 1],
        ];
        this.position = this.pos1;

        this.shiftX = 4; // Startposition in der Mitte
        this.shiftY = 0;
        this.color = "#FF0000"; // Rot wie TNT
        this.isExploded = false; // Status der Explosion
    }

    shiftXRight() {
        if (this.shiftX < 8) {
            this.shiftX += 1;
        }
    }

    shiftXLeft() {
        if (this.shiftX > 0) {
            this.shiftX -= 1;
        }
    }

    shiftYDown() {
        if (this.shiftY < 19) {
            this.shiftY += 1;
        }
    }

    
    rotate() {}

    revertColor() {}


    animateTick() {
        this.color = this.color === "#FF0000" ? "#FEFEFE" : "#FF0000"; // Rot zu Orange

    }
}