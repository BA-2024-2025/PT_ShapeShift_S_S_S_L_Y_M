import {Tetromino} from "./Tetromino.js";
import { moveValidation } from "./GameFunctions.js";

let oldColor;
export class SwitchTetromino extends Tetromino {

    constructor() {

        //only here for satisfaction of js
        super();

        //creates the different positions for rotation
        //S
        this.pos1 = [
            [1,1],
            [2,1],
            [0,2],
            [1,2],
        ];
        //L
        this.pos2 = [
            [0,1],
            [1,1],
            [2,1],
            [0,2]
        ];
        //T
        this.pos3 = [
            [0, 1],
            [1, 0],
            [1, 1],
            [2, 1]
        ];
        //O
        this.pos4 = [
            [0,0],
            [1,0],
            [0,1],
            [1,1]
        ];

        this.position = this.pos1

        //for placing the block right in the real field kinda the shift
        this.shiftX = 3;
        this.shiftY = 0;
        this.color = "#00F700";
    }

    //moves to the right
    shiftXRight() {
        switch (this.position) {
            case this.pos1:
                if (this.shiftX<7||(this.position===this.pos2&&this.shiftX<8)) {
                    this.shiftX += 1;
                }
                break;
            case this.pos2:
                if (this.shiftX<7||(this.position===this.pos3&&this.shiftX<8)) {
                    this.shiftX += 1;
                }
                break;
            case this.pos3:
                if (this.shiftX<7 || this.position === this.pos2 && this.shiftX<8) {
                    this.shiftX += 1;
                }
                break;
            case this.pos4:
                if (this.shiftX<8) {
                    this.shiftX += 1;
                }
                break;
        
            default:
                break;
        }
    }

    //moves to the left
    shiftXLeft() {
        switch (this.position) {
            case this.pos1:
                if (this.shiftX>0||(this.position===this.pos4&&this.shiftX>-1)) {
                    this.shiftX -= 1;
                }
                break;
            case this.pos2:
                if (this.shiftX>0||(this.position===this.pos1&&this.shiftX>-1)) {
                    this.shiftX -= 1;
                }
                break;
            case this.pos3:
                if (this.shiftX>0 || this.position === this.pos4 && this.shiftX>-1) {
                    this.shiftX -= 1;
                }
                break;
            case this.pos4:
                if (this.shiftX>0) {
                    this.shiftX -= 1;
                }
                break;
        
            default:
                break;
        }
    }

    //moves down
    shiftYDown() {
        switch (this.position) {
            case this.pos1:
                if (this.shiftY<18) {
                    this.shiftY += 1;
                }
                break;
            case this.pos2:
                if (this.shiftY<18||(this.position===this.pos4&&this.shiftY<19)) {
                    this.shiftY += 1;
                }
                break;
            case this.pos3:
                if (this.shiftY<18 || this.position === this.pos3 && this.shiftY<19) {
                    this.shiftY += 1;
                }
                break;
            case this.pos4:
                if (this.shiftY<19) {
                    this.shiftY += 1;
                }
                break;
        
            default:
                break;
        }
    }

    //rotates tetromino by 90°
    rotate() {
        switch (this.position) {
            case this.pos1:
                if (this.position === this.pos1 && this.shiftX>-1) {
                    this.setPosition(this.pos2);
                    oldColor = this.color;
                    this.color = "#FF5C00";
                }
                break;
            case this.pos2:
                if (this.position === this.pos2 && this.shiftX<8) {
                    this.setPosition(this.pos3);
                    oldColor = this.color;
                    this.color = "#8e27de";
                }
                break;
            case this.pos3:
                if (this.position === this.pos3) {
                    this.setPosition(this.pos4);
                    oldColor = this.color;
                    this.color = "#f5ff00";
                }
                break;
            case this.pos4:
                if (this.position === this.pos4&&this.shiftX>-1) {
                    this.setPosition(this.pos1);
                    oldColor = this.color;
                    this.color = "#00F700";
                }
                break;
        
            default:
                break;
        }
    }
   
    revertColor() {
        this.color = oldColor;
    }
}

