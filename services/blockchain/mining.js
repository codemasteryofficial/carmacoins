// Handles the mining process for new blocks
class Mining {
    constructor(difficulty) {
        this.difficulty = difficulty
    }

    mineBlock(block) {
        while (block.hash.substring(0, this.difficulty) !== Array(this.difficulty + 1).join("0")) {
            block.nonce++
            block.hash = block.calculateHash()
        }
        console.log(`Block mined: ${block.hash}`)
    }
}

export default Mining