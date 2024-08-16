import express from 'express'
import crypto from 'crypto-js'
import bodyParser from 'body-parser'

import Blockchain from './services/blockchain/index.js'
import { MiningService } from './services/blockchain/index.js'
import { Vote, VoterRegistry, VoteValidator } from './services/votingsystem/index.js'

import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


console.log(__dirname);

const app = express()
app.use(bodyParser.json())

const voterRegistry = new VoterRegistry()
const voteValidator = new VoteValidator()
const miningService = new MiningService(1)

const blockchain = new Blockchain(miningService, voteValidator, voterRegistry)

const candidates = []

function registerCandidates(candidate){
    if (candidates.indexOf(candidate) === -1) {
        candidates.push(candidate)
    }
}

app.get('/', (req, res) => {
    res.sendFile('./pages/index.html', { root: __dirname })  
})

app.get('/results', (req, res) => {
    res.sendFile('./pages/results.html', { root: __dirname })  
})

app.get('/auth', async (req, res) => {
    const { voterId } = req.query
    const signature = crypto.SHA256(voterId).toString()
    res.json({ signature })
})

app.post('/vote', async (req, res) => {
    const { voterId, signature, candidate } = req.body
    // Basic validation
    if (!voterId || !signature || !candidate) {
        return res.json({ message: 'Voter ID, signature and candidate are required' })
    }

    const isSignatureValid = crypto.SHA256(voterId).toString() === signature

    if (!isSignatureValid) {
        return res.json({ message: 'Voter ID signature does not match' })
    }

    try {
        const vote = new Vote(voterId, candidate)
        blockchain.addVote(vote)
        blockchain.minePendingVotes()
        registerCandidates(candidate)
        res.json({ message: 'Vote has been recorded'})
    } catch (error) {
        res.json({ message: error.message})
    }
})

app.post('/results', (req, res) => {
    const results = {}
    for(let candidate of candidates) {
        results[candidate] = blockchain.getVotesForCandidate(candidate)
    }
    res.json(results)
})

app.get('/validate', (req, res) => {
    const isChainValid = blockchain.isChainValid()
    res.json({ isValid : isChainValid })
})


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})
