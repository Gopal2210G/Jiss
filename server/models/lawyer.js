const mongoose = require('mongoose');

const lawyerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  loginType: {
    type: String,
    required: true,
    enum: ['lawyer', 'registrar', 'judge'],
  },
  count: {
    type: Number,
    default: 0,
  },
});

const Lawyer = mongoose.model('Lawyer', lawyerSchema);

module.exports = Lawyer;
