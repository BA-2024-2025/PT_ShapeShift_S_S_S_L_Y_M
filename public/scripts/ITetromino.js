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

    shiftXRight() {
        if (this.getShiftX()<6 || (this.getShiftX()<8 && this.position === this.pos2)) {
            this.shiftX += 1;
        }
    }

    shiftXLeft() {
        if (this.getShiftX()>0 || (this.getShiftX()>-1 && this.position === this.pos2)) {
            this.shiftX -= 1;
        }
    }

    shiftYDown() {
        if ((this.getShiftY()<19 && this.getPosition() === this.pos1) || this.getShiftY()<17) {
            this.shiftY += 1;
        }
    }

    rotate(){
        if (this.position === this.pos1 && this.getShiftY()<17) {
            this.setPosition(this.pos2);
        } else if (this.position === this.pos2 && this.getShiftX()>-1 && this.getShiftX()<7){
            this.setPosition(this.pos1);
        }
    }

    getGridPosition() {
        return [
            [this.getPosition()[0][0] + this.getShiftX(), this.getPosition()[0][1] + this.getShiftY()],
            [this.getPosition()[1][0] + this.getShiftX(), this.getPosition()[1][1] + this.getShiftY()],
            [this.getPosition()[2][0] + this.getShiftX(), this.getPosition()[2][1] + this.getShiftY()],
            [this.getPosition()[3][0] + this.getShiftX(), this.getPosition()[3][1] + this.getShiftY()]
        ];
    }

    getElementIdGrid (gridPosition) {
        return [
            String(gridPosition[0][0]) + String(gridPosition[0][1]),
            String(gridPosition[1][0]) + String(gridPosition[1][1]),
            String(gridPosition[2][0]) + String(gridPosition[2][1]),
            String(gridPosition[3][0]) + String(gridPosition[3][1])
        ];
    }

    getColor() {
        return this.color;
    }

    setColor(value) {
        this.color = value;
    }

    getPosition() {
        return this.position;
    }

    setPosition(value) {
        this.position = value;
    }

    getShiftX() {
        return this.shiftX;
    }

    setShiftX(value) {
        this.shiftX = value;
    }

    getShiftY() {
        return this.shiftY;
    }

    setShiftY(value) {
        this.shiftY = value;
    }
}