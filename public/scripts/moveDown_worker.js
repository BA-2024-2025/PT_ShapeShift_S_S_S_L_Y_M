function moveDown(shape) {
    console.log("working ...");
    shape.shiftYDown()
    if (shape.position === shape.pos3 && shape.getShiftY()===18) {
        this.terminate();
    }
    setTimeout("moveDown(shape)",500)
}

moveDown();