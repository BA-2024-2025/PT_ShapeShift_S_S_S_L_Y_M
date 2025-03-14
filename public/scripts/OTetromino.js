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

    //translates my cords in the grid cords
    getGridPosition() {
        return [
            [this.position[0][0] + this.shiftX, this.position[0][1] + this.shiftY],
            [this.position[1][0] + this.shiftX, this.position[1][1] + this.shiftY],
            [this.position[2][0] + this.shiftX, this.position[2][1] + this.shiftY],
            [this.position[3][0] + this.shiftX, this.position[3][1] + this.shiftY]
        ];
    }

    //translates the grid cords in element id
    getElementIdGrid (gridPosition) {
        return [
            String(gridPosition[0][0]) + String(gridPosition[0][1]),
            String(gridPosition[1][0]) + String(gridPosition[1][1]),
            String(gridPosition[2][0]) + String(gridPosition[2][1]),
            String(gridPosition[3][0]) + String(gridPosition[3][1])
        ];
    }
}