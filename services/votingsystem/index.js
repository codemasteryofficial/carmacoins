
class Vote {
    constructor(voterId, candidateId) {
        this.voterId = voterId
        this.candidateId = candidateId
    }
}

// Manages the registration and validation of voters
class VoterRegistry {
    constructor() {
        this.voterRegistry = new Set() // To track voters and prevent double voting
    }

    registerVoter(voterId) {
        if (this.voterRegistry.has(voterId)) {
            throw new Error('Voter has already voted')
        }
        this.voterRegistry.add(voterId)
    }

    hasVoted(voterId) {
        return this.voterRegistry.has(voterId)
    }
}



// Ensures the integrity and validity of votes before they are added to the blockchain
class VoteValidator {
    validateVote(vote, voterRegistry) {
        if (!vote.voterId || !vote.candidateId) {
            throw new Error('Invalid vote: Missing voterId or candidateId')
        }
        if (voterRegistry.hasVoted(vote.voterId)) {
            throw new Error('Invalid vote: Voter has already voted')
        }
    }
}

export { Vote, VoterRegistry, VoteValidator }

