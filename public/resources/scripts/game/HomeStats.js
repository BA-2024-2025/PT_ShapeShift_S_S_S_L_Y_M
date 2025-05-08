let blocks = 0;
let score = 0;

export function sendScore(value) {
    //window.parent.updateScore(score);
    let scoreText = window.parent.document.getElementsByClassName("score")[0].getElementsByTagName("h1")[0];
    score += value;
    scoreText.textContent = "Score: " + score;
}

export function sendBlocks(value) {
    //window.parent.updateBlocks(blocks);
    let blockText = window.parent.document.getElementsByClassName("blocks")[0].getElementsByTagName("h1")[0];
    blocks += value;
    blockText.textContent = "Blocks: " + blocks;
}

export function resetScore() {
    //window.parent.nullScore();
    let scoreText = window.parent.document.getElementsByClassName("score")[0].getElementsByTagName("h1")[0];
    score = 0;
    scoreText.textContent = "Score: " + score;
}

export function resetBlocks() {
    //window.parent.nullBlocks();
    let blockText = window.parent.document.getElementsByClassName("blocks")[0].getElementsByTagName("h1")[0];
    blocks = 0;
    blockText.textContent = "Blocks: " + blocks;
}

export function getScore() {
    let scoreElement = window.parent.document.getElementsByClassName("score")[0].getElementsByTagName("h1")[0];
    let scoreText = scoreElement.textContent;
    return scoreText.slice(7);
}

export function changeNextBlockImage(nextBlock) {

    //gets the specification of the next tetromino
    let firstIndex = nextBlock.indexOf("class ");
    console.log(firstIndex+6);
    let endIndex = nextBlock.indexOf("Tetromino");
    console.log(endIndex);
    let letter = nextBlock.substring(firstIndex+6,endIndex).trim().toLowerCase();

    //selects the image
    const imgBlock = window.parent.document.getElementById("nextBlockImage");

    console.log("letter: " + letter);

    imgBlock.src = "/public/resources/assets/images/nextBlocks/"+letter+".png"
}