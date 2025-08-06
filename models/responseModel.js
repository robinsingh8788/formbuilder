const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  form: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  answers: [
    {
      questionId: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Response', responseSchema);
