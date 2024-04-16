const mongoose = require('mongoose');

const hearingSchema = new mongoose.Schema({
    hearingDate: {
        type: Date,
        required: true
    },
    hearingSlot: {
        type: String,
        required: true
    },
    adjorned_Reason: {
        type: String,
        required: false
    },
    summary: {
        type: String,
        required: false
    }
});


const caseSchema = new mongoose.Schema({
    cin: {
        type: String,
        // required: true,
        unique: true
    },
    defendantName: {
        type: String,
        required: true
    },
    defendantAddress: {
        type: String,
        required: true
    },
    crimeType: [{
        type: String,
        enum: ['theft', 'murder', 'arson'],
        required: true
    }],
    dateCommitted: {
        type: Date,
        required: true
    },
    locationCommitted: {
        type: String,
        required: true
    },
    arrestingOfficer: {
        type: String,
        required: true
    },
    caseStatus: [{
        type: String,
        enum: ['Solved', 'Running', 'Pending'],
        required: true
    }],
    judgeAssigned: {
        type: String,
        required: true
    },
    lawyer: {
        type: String,
        required: true
    },
    publicProsecutor: {
        type: String,
        required: true
    },
    dateOfArrest: {
        type: Date,
        required: true
    }, 
    judgement: {
        type: String,
        required: false
    },
    hearings: [hearingSchema],
}, { timestamps: true });


caseSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastCase = await Case.findOne().sort({ createdAt: -1 });
        if (lastCase && lastCase.cin) {
            const lastSeq = parseInt(lastCase.cin.substring(3));
            this.cin = `CIN${(lastSeq + 1).toString().padStart(6, '0')}`;
        } else {
            this.cin = `CIN000001`;
        }
    }
    next();
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
