const Response = require('../models/responseModel');
const Form = require('../models/formModel');

// Submit a response to a form
const submitResponse = async (req, res) => {
  try {
    const { formId, answers } = req.body;

    // Check if form exists and is published
    const form = await Form.findById(formId);
    if (!form) return res.status(404).json({ message: 'Form not found' });
    if (form.status !== 'published') {
      return res.status(403).json({ message: 'Form is not published' });
    }

    const response = new Response({
      form: formId,
      answers,
    });

    await response.save();

    res.status(201).json({ message: 'Response submitted successfully', response });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting response', error: error.message });
  }
};

// Get all responses for a form
const getFormResponses = async (req, res) => {
  try {
    const { formId } = req.params;

    const responses = await Response.find({ form: formId }).sort({ submittedAt: -1 });

    res.status(200).json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses', error: error.message });
  }
};

module.exports = {
  submitResponse,
  getFormResponses,
};
