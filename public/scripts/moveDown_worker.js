console.log("worker is running ...");

let running = true;

//posts a message so the tetromino can move done automatically
function moveDown() {
    if (running) {
        self.postMessage("shiftYDown");
        setTimeout(() =>moveDown(),500);
    }
}

self.onmessage = function (e) {
    if (e.data === "stop") {
        running = false;
    }
};

moveDown();

