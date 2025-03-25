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

export function changeNextBlock(imgBlock) {
    //nextBlock(imgPath);
    let imgPath;
    switch (imgBlock) {
        case TTetromino:
            console.log("switch")
            imgPath = "t.png";
            break;

        case OTetromino:
            console.log("switch")
            imgPath = "o.png";
            break;

        case PlusTetromino:
            console.log("switch")
            imgPath = "plus.png";
            break;

        case UTetromino:
            console.log("switch")
            imgPath = "u.png";
            break;

        case ITetromino:
            console.log("switch")
            imgPath = "i.png";
            break;

        case LTetromino:
            console.log("switch")
            imgPath = "l.png";
            break;

        case JTetromino:
            console.log("switch")
            imgPath = "j.png";
            break;

        case STetromino:
            console.log("switch")
            imgPath = "s.png";
            break;

        case ZTetromino:
            console.log("switch")
            imgPath = "z.png";
            break;

        default:
            console.log("Unknown tetromino");
            break;
    }
    return imgPath;
}