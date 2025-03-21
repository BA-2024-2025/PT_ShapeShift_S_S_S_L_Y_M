export function sendScore(score) {
    window.parent.updateScore(score);
}

export function sendBlocks(blocks) {
    window.parent.updateBlocks(blocks);
}

export function resetScore() {
    window.parent.nullScore();
}

export function resetBlocks() {
    window.parent.nullBlocks();
}
