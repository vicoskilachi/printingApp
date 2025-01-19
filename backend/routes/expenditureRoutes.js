const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');

// Routes
router.get('/', expenditureController.getAllExpenditures);
router.get('/:id', expenditureController.getExpenditureById);
router.post('/', expenditureController.createExpenditure);
router.put('/:id', expenditureController.updateExpenditureById);
router.delete('/:id', expenditureController.deleteExpenditureById);

module.exports = router;
