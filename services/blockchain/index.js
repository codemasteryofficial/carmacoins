
import Block from './block.js'
import MiningService from './mining.js'

class Blockchain {
    constructor(miningService, voteValidator, voterRegistry) {
        this.chain = [this.createGenesisBlock()]
        this.pendingVotes = []
        this.miningService = miningService
        this.voteValidator = voteValidator
        this.voterRegistry = voterRegistry
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2024", [], "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addVote(vote) {
        this.voteValidator.validateVote(vote, this.voterRegistry)
        this.voterRegistry.registerVoter(vote.voterId)
        this.pendingVotes.push(vote)
    }

    minePendingVotes() {
        const newBlock = new Block(
            this.chain.length,
            Date.now().toString(),
            this.pendingVotes,
            this.getLatestBlock().hash
        )

        this.miningService.mineBlock(newBlock)
        this.chain.push(newBlock)
        this.pendingVotes = [] // Reset pending votes after block is mined
    }

    getVotesForCandidate(candidateId) {
        let voteCount = 0

        for (const block of this.chain) {
            for (const vote of block.votes) {
                if (vote.candidateId === candidateId) {
                    voteCount++
                }
            }
        }

        return voteCount
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false
            }

            if (currentBlock.timestamp <= previousBlock.timestamp) {
                return false
            }
        }

        return true
    }
}


export { MiningService }
export default Blockchain



