const mongoose = require('mongoose');

const specialSchema = new mongoose.Schema({
    id_: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
});

const Special = new mongoose.model("Special", specialSchema);
module.exports = Special;

