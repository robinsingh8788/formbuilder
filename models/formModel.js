const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: String,
  questionType: String,
  options: [String],
  required: Boolean,
  conditional: {
    questionId: String,
    value: String,
  },
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questions: [questionSchema],
  isPublished: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Form = mongoose.model('Form', formSchema);

module.exports = Form;
