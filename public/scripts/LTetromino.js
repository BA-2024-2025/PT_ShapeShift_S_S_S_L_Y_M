import {Tetromino} from "./Tetromino.js";

export class LTetromino extends Tetromino {

    constructor() {

        //only here for satisfaction of js
        super();

        //creates the different positions for rotation
        this.pos1 = [
            [1,0],
            [1,1],
            [1,2],
            [2,2]
        ];
        this.pos2 = [
            [0,1],
            [1,1],
            [2,1],
            [0,2]
        ];
        this.pos3 = [
            [0,0],
            [1,0],
            [1,1],
            [1,2]
        ];
        this.pos4 = [
            [2,0],
            [0,1],
            [1,1],
            [2,1]
        ];

        this.position = this.pos1

        //for placing the block right in the real field kinda the shift
        this.shiftX = 3;
        this.shiftY = 0;
        this.color = "#FF5C00";
    }

    //moves to the right
    shiftXRight() {
        if (this.shiftX<7||(this.position===this.pos3&&this.shiftX<8)) {
            this.shiftX += 1;
        }
    }

    //moves to the left
    shiftXLeft() {
        if (this.shiftX>0||(this.position===this.pos1&&this.shiftX>-1)) {
            this.shiftX -= 1;
        }
    }

    //moves down
    shiftYDown() {
        if (this.shiftY<18||(this.position===this.pos4&&this.shiftY<19)) {
            this.shiftY += 1;
        }
    }

    //rotates tetromino by 90°
    rotate() {
        if (this.position === this.pos1 && this.shiftX>-1) {
            this.setPosition(this.pos2);
        } else if (this.position === this.pos2) {
            this.setPosition(this.pos3);
        } else if (this.position === this.pos3 && this.shiftX<8) {
            this.setPosition(this.pos4);
        } else if (this.position === this.pos4 && this.shiftY<18) {
            this.setPosition(this.pos1);
        }
    }
}