
//parent class for all shapes
export class Tetromino {

    shiftXRight(){};
    shiftXLeft(){};
    shiftYDown(){};
    rotate(){}

    //translates my cords to grid cords
    getGridPosition() {
        const positions = [];
        for (let i = 0; i < this.position.length; i++) {
            positions.push([this.position[i][0] + this.shiftX, this.position[i][1] + this.shiftY]);
        }
        return positions;
    }

    //translates grid cords to element id
    getElementIdGrid (gridPosition) {
        return gridPosition.map(pos => String(pos[0]) + String(pos[1]));
    }

    setPosition(pos) {
        this.position = pos;
    }

}