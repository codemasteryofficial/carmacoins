import Blockchain from './services/blockchain/index.js'
import { MiningService } from './services/blockchain/index.js'
import { Vote, VoterRegistry, VoteValidator } from './services/votingsystem/index.js'

const voterRegistry = new VoterRegistry()
const voteValidator = new VoteValidator()
const miningService = new MiningService(1)

const blockchain = new Blockchain(miningService, voteValidator, voterRegistry)


try {
    const vote1 = new Vote("Voter1", "CandidateA")
    blockchain.addVote(vote1)
    const vote2 = new Vote("Voter2", "CandidateA")
    blockchain.addVote(vote2)

    blockchain.minePendingVotes()

    const vote3 = new Vote("Voter3", "CandidateB")
    blockchain.addVote(vote3)

    blockchain.minePendingVotes()

    console.log(`Votes for CandidateA: ${blockchain.getVotesForCandidate("CandidateA")}`)
    console.log(`Votes for CandidateB: ${blockchain.getVotesForCandidate("CandidateB")}`)

    console.log(`Is blockchain valid? ${blockchain.isChainValid()}`)
} catch (error) {
    console.error(error.message)
}
