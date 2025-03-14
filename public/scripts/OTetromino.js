import {Tetromino} from "./Tetromino.js";

export class OTetromino extends Tetromino{

    constructor() {

        //only here for satisfaction of js
        super();

        this.position = [
            [0,0],
            [1,0],
            [0,1],
            [1,1]
        ];

        this.shiftX = 4;
        this.shiftY = 1;
        this.color = "#f5ff00";
    }

    //moves block to the right
    shiftXRight() {
        if (this.shiftX<8) {
            this.shiftX += 1;
        }
    }

    //moves block to the left
    shiftXLeft() {
        if (this.shiftX>0) {
            this.shiftX -= 1;
        }
    }

    //moves block down
    shiftYDown() {
        if (this.shiftY<19) {
            this.shiftY += 1;
        }
    }
     //rotates block with 90°, sadly our square can't be rotated
    rotate() {
        //be sad
    }
}