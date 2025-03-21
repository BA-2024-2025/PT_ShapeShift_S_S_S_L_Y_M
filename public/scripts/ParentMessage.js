let blocks = 0;
let score = 0;

window.updateScore = function(value) {
    let scoreText = document.getElementsByClassName("score")[0].getElementsByTagName("h1")[0];
    score += value;
    scoreText.textContent = "Score: " + score;
}

window.updateBlocks = function(value) {
    let blockText = document.getElementsByClassName("blocks")[0].getElementsByTagName("h1")[0];
    blocks += value;
    blockText.textContent = "Block: " + blocks;
}

