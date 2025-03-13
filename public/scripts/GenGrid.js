
const app = document.getElementById("app")

let count = 0;
for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 10; x++) {
        const child = document.createElement("div")
        child.id = x + "" + y;
        child.className = "container"
        child.style.gridColumn= x + 1;
        child.style.gridRow= y + 1;
        app.appendChild(child)
        count += 1
    }
}
console.log("count", count)
