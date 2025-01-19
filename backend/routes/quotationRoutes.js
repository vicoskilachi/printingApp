const express = require('express');
const { createQuote, getQuote, updateQuote, deleteQuote } = require('../controllers/quotationController');


const router = express.Router();

// Create a new quote
router.post('/', createQuote);
router.get('/', getQuote);
router.put('/:id', updateQuote);
router.delete('/:id', deleteQuote);

module.exports = router;