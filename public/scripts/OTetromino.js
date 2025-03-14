export class OTetromino {

    constructor() {
        this.position = [
            [0,0],
            [1,0],
            [0,1],
            [1,1]
        ];

        this.shiftX = 4;
        this.shiftY = 0;
        this.color = "#f5ff00";
    }

    shiftXRight() {
        if (this.getShiftX()<8) {
            this.shiftX += 1;
        }
    }

    shiftXLeft() {
        if (this.getShiftX()>0) {
            this.shiftX -= 1;
        }
    }

    shiftYDown() {
        if (this.getShiftY()<19) {
            this.shiftY += 1;
        }
    }

    rotate() {
        //be sad
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