console.log("worker is running ...");

function moveDown() {
    self.postMessage("shiftYDown")
    setTimeout(() =>moveDown(),500)
}

moveDown();

