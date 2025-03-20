import {Tetromino} from "./Tetromino.js";

export class UTetromino extends Tetromino {
    constructor() {
        super();
        this.pos1 = [
            [0,0],
            [2,0],
            [0,1],
            [1,1],
            [2,1],
        ];
        this.pos2 = [
            [1,0],
            [1,2],
            [0,0],
            [0,1],
            [0,2],
        ];
        this.pos3 = [
            [2,1],
            [0,1],
            [2,0],
            [1,0],
            [0,0],
        ];
        this.pos4 = [
            [0,2],
            [0,0],
            [1,2],
            [1,1],
            [1,0],
        ];
        this.position = this.pos1;
        this.shiftX = 2;
        this.shiftY = 0;
        this.color = "#A808A8";
    }

    shiftXRight() {
        if (this.position === this.pos1 && this.shiftX < 7) this.shiftX += 1;
        else if (this.position === this.pos2 && this.shiftX < 8) this.shiftX += 1;
        else if (this.position === this.pos3 && this.shiftX < 7) this.shiftX += 1;
        else if (this.position === this.pos4 && this.shiftX < 8) this.shiftX += 1;
        else if (this.shiftX < 9) this.shiftX += 1;
    }

    shiftXLeft() {
        if (this.shiftX > 0) this.shiftX -= 1;
    }

    shiftYDown() {
        if (this.position === this.pos1 && this.shiftY < 19) this.shiftY += 1;
        else if (this.position === this.pos2 && this.shiftY < 18) this.shiftY += 1;
        else if (this.position === this.pos3 && this.shiftY < 19) this.shiftY += 1;
        else if (this.position === this.pos4 && this.shiftY < 18) this.shiftY += 1;
        else if (this.shiftY < 20) this.shiftY += 1;
    }

    rotate() {
        if (this.position === this.pos1) {
            this.setPosition(this.pos2);
        }
        else if (this.position === this.pos2 && this.shiftX < 8) {
            this.setPosition(this.pos3);
        }
        else if (this.position === this.pos3 && this.shiftY < 19) {
            this.setPosition(this.pos4);
        }
        else if (this.position === this.pos4 && this.shiftX > -1) {
            this.setPosition(this.pos1);
        }
    }
}
