const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  amount: { type: Number, required: true },
  spender: {type: String, required: true},
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
