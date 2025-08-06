const express = require('express');
const router = express.Router();
const {
  createForm,
  updateForm,
  publishForm,
  getForms,
  getPublishedForms,
  getFormById,
  deleteForm,
  saveFormAsDraft
} = require('../controllers/formController');
const { protect } = require('../middleware/authMiddleware');

// Routes
router.post('/', protect, createForm);
router.put('/:id', protect, updateForm);
router.put('/:id/publish', protect, publishForm);
router.get('/user', protect, getForms); // Get forms by user
router.get('/published', getPublishedForms);
router.get('/:id', getFormById);
router.delete('/:id', protect, deleteForm);
router.put('/:id/draft', protect, saveFormAsDraft);

module.exports = router;
