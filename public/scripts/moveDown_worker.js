console.log("worker is running ...");


let running = true;
let speed = 500;

//posts a message so the tetromino can move done automatically
function moveDown() {
    if (running) {
        self.postMessage("shiftYDown");
        setTimeout(() => moveDown(), speed); // Dynamische Geschwindigkeit
    }
}

self.onmessage = function (e) {
    if (e.data === "stop") {
        running = false;
    } else if (e.data === "down") {
        speed = 40; // Schnellere Geschwindigkeit, wenn ArrowDown gedrückt wird
    } else if (e.data === "reset") {
        // Zurücksetzen auf Level-basierte Geschwindigkeit
        if (speed === 40) {
            speed = level === 1 ? 500 : level === 2 ? 300 : 200;
        }
    } else if (typeof e.data === "number") {
        // Level setzen und Geschwindigkeit anpassen
        level = e.data;
        speed = level === 1 ? 500 : level === 2 ? 300 : 200;
    }
};

let level = 1;

moveDown();

