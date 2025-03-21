export function sendScore(score) {
    window.parent.updateScore(score);
}

export function sendBlocks(blocks) {
    window.parent.updateBlocks(blocks);
}