
//parent class for all shapes
export class Tetromino {

    shiftXRight(){};
    shiftXLeft(){};
    shiftYDown(){};
    rotate(){}

    //translates my cords to grid cords
    getGridPosition() {
        return [
            [this.position[0][0] + this.shiftX, this.position[0][1] + this.shiftY],
            [this.position[1][0] + this.shiftX, this.position[1][1] + this.shiftY],
            [this.position[2][0] + this.shiftX, this.position[2][1] + this.shiftY],
            [this.position[3][0] + this.shiftX, this.position[3][1] + this.shiftY]
        ];
    }

    //translates grid cords to element id
    getElementIdGrid (gridPosition) {
        return [
            String(gridPosition[0][0]) + String(gridPosition[0][1]),
            String(gridPosition[1][0]) + String(gridPosition[1][1]),
            String(gridPosition[2][0]) + String(gridPosition[2][1]),
            String(gridPosition[3][0]) + String(gridPosition[3][1])
        ];
    }

    setPosition(pos) {
        this.position = pos;
    }

}