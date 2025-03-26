import {Tetromino} from "./Tetromino.js";

export class LineClearTetromino extends Tetromino{

    constructor() {

        //only here for satisfaction of js
        super();

        this.position = [
            [0,0]
        ];

        this.shiftX = 5;
        this.shiftY = 1;
        this.color = "#cba201";
    }

    //moves block to the right
    shiftXRight() {
        if (this.shiftX<9) {
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
        if (this.shiftY<20) {
            this.shiftY += 1;
        }
    }
     //rotates block with 90°, sadly our square can't be rotated
    rotate() {
        //be sad
    }
    
    revertColor() {
    }
}