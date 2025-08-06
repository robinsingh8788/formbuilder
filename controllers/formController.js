const Form = require('../models/formModel');

// Create a new form
const createForm = async (req, res) => {
  try {
    const { title, questions } = req.body;

    const form = new Form({
      title,
      questions,
      user: req.user._id,
    });

    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(500).json({ message: 'Form creation failed', error });
  }
};

// Update a form (draft or before publishing)
const updateForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, questions } = req.body;
    form.title = title || form.title;
    form.questions = questions || form.questions;

    const updatedForm = await form.save();
    res.json(updatedForm);
  } catch (error) {
    res.status(500).json({ message: 'Form update failed', error });
  }
};

// Publish a form
const publishForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    form.isPublished = true;
    const publishedForm = await form.save();
    res.json(publishedForm);
  } catch (error) {
    res.status(500).json({ message: 'Publish failed', error });
  }
};

// Get all forms by the logged-in user
const getAllFormsByUser = async (req, res) => {
  try {
    const forms = await Form.find({ user: req.user._id });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch forms', error });
  }
};

// Get all published forms (for preview or public view)
const getPublishedForms = async (req, res) => {
  try {
    const forms = await Form.find({ isPublished: true });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch published forms', error });
  }
};

// Get form by ID (for editing or viewing)
const getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    res.json(form);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching form', error });
  }
};

// Delete a form
const deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (form.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await form.remove();
    res.json({ message: 'Form deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error });
  }
};

module.exports = {
  createForm,
  updateForm,
  publishForm,
  getForms: getAllFormsByUser, // 👈 renamed for matching import
  getPublishedForms,
  getFormById,
  deleteForm,
  saveFormAsDraft: async (req, res) => {
    try {
      const form = await Form.findById(req.params.id);

      if (!form) {
        return res.status(404).json({ message: 'Form not found' });
      }

      if (form.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      form.isPublished = false; // Or use a `status` field if defined
      const draftForm = await form.save();
      res.json({ message: 'Form saved as draft', form: draftForm });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save as draft', error });
    }
  }
};
