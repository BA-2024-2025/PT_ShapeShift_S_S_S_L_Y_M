console.log("worker is running ...");

//posts a message so the tetromino can move done automatically
function moveDown() {
    self.postMessage("shiftYDown");
    setTimeout(() =>moveDown(),1000);
}

moveDown();

