import {Tetromino} from "./Tetromino.js";

export class ITetromino extends Tetromino{

    constructor() {

        //only here for satisfaction of js
        super();

        //different positions for rotation
        this.pos1 = [
            [0,1],
            [1,1],
            [2,1],
            [3,1]
        ];

        this.pos2 = [
            [1,0],
            [1,1],
            [1,2],
            [1,3]
        ];

        this.position = this.pos1;

        //placing the block in the right grid in real
        this.shiftX = 3;
        this.shiftY = 0;
        this.color = "#4DFFFF";
    }

    //moves to the right
    shiftXRight() {
        if (this.shiftX<6 || (this.shiftX<8 && this.position === this.pos2)) {
            this.shiftX += 1;
        }
    }

    //moves to the left
    shiftXLeft() {
        if (this.shiftX>0 || (this.shiftX>-1 && this.position === this.pos2)) {
            this.shiftX -= 1;
        }
    }

    //moves down
    shiftYDown() {
        if ((this.shiftY<19 && this.position === this.pos1) || this.shiftY<17) {
            this.shiftY += 1;
        }
    }

    //rotates tetromino by 90°
    rotate(){
        if (this.position === this.pos1 && this.shiftY<17) {
            this.setPosition(this.pos2);
        } else if (this.position === this.pos2 && this.shiftX>-1 && this.shiftX<7){
            this.setPosition(this.pos1);
        }
    }
}