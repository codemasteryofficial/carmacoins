import crypto from 'crypto-js'

class Block {
    constructor(index, timestamp, votes, previousHash = '', nonce = 0) {
        this.index = index
        this.timestamp = timestamp
        this.votes = votes
        this.previousHash = previousHash
        this.nonce = nonce
        this.hash = this.calculateHash()
    }
    calculateHash() {
        return crypto.SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.votes) + this.nonce).toString()
    }
}

export default Block
