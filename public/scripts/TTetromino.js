class TTetromino {

    constructor(color) {

        //creates the different positions for rotation
        this.pos1 = [
            [0, 1],
            [1, 1],
            [2, 1],
            [1, 2]
        ];
        this.pos2 = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, 2]
        ];
        this.pos3 = [
            [0, 1],
            [1, 0],
            [1, 1],
            [2, 1]
        ];
        this.pos4 = [
            [0, 1],
            [1, 1],
            [2, 1],
            [1, 2]
        ];

        this.position = this.pos1

        //for placing the block right in the real field kinda the shift
        this.shiftX = 5;
        this.shiftY = 0;
        this.color = color;

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
        this.shiftY += 1;
    }

    rotate() {
        if (this.position === this.pos1) {
            this.setPosition(this.pos2);
        } else if (this.position === this.pos2) {
            this.setPosition(this.pos3);
        } else if (this.position === this.pos3) {
            this.setPosition(this.pos4);
        } else {
            this.setPosition(this.pos1);
        }
    }

    getGridPosition() {
        return [
           [this.getPosition()[0][0] + this.getShiftX(), this.getPosition()[0][1] + this.getShiftY()],
           [this.getPosition()[1][0] + this.getShiftX(), this.getPosition()[1][1] + this.getShiftY()],
           [this.getPosition()[2][0] + this.getShiftX(), this.getPosition()[2][1] + this.getShiftY()]
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