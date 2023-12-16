const Candidate = require('../models/candidateModel');

async function addCandidateRecord(candidateData) {
    console.log("controller se");
    try {
        const candidate = new Candidate(candidateData);
        await candidate.save();
        console.log("here2");

        return { success: true, message: 'Candidate record added successfully' };
    } catch (error) {
        console.log(error);

        return { success: false, message: 'Error adding candidate record', error: error.message };
    }
}

async function checkDuplicateEmail(email) {
    console.log("here");
    const existingCandidate = await Candidate.findOne({ email });
    return existingCandidate !== null;
}

module.exports = { addCandidateRecord, checkDuplicateEmail };
