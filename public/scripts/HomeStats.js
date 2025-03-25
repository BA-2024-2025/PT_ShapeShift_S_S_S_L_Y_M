import {TTetromino} from "./TTetromino.js";
import {OTetromino} from "./OTetromino.js";
import {PlusTetromino} from "./PlusTetromino.js";
import {UTetromino} from "./UTetromino.js";
import {ITetromino} from "./ITetromino.js";
import {LTetromino} from "./LTetromino.js";
import {JTetromino} from "./JTetromino.js";
import {STetromino} from "./STetromino.js";
import {ZTetromino} from "./ZTetromino.js";

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
    let index = nextBlock.indexOf("Tetromino");
    let letter = nextBlock[5,index-1].toLowerCase();

    //selects the image
    const imgBlock = window.parent.document.getElementById("nextBlockImage");

    imgBlock.src = "/public/images/nextBlocks/"+letter+".png"
}