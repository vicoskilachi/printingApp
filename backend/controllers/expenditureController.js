const Expenditure = require('../models/expenditureModel');

// Get all expenditures
exports.getAllExpenditures = async (req, res) => {
  try {
    const expenditures = await Expenditure.find().sort({ date: -1 });
    res.json(expenditures);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenditures', error });
  }
};

// Get an expenditure by ID
exports.getExpenditureById = async (req, res) => {
  try {
    const expenditure = await Expenditure.findById(req.params.id);
    if (!expenditure) return res.status(404).json({ message: 'Expenditure not found' });
    res.status(200).json(expenditure);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new expenditure
exports.createExpenditure = async (req, res) => {
  const { itemName, amount, spender, date } = req.body;
  try {
    const newExpenditure = new Expenditure({ itemName, amount, spender, date });
    await newExpenditure.save();
    res.json(newExpenditure);
  } catch (error) {
    res.status(500).json({ message: 'Error creating expenditure', error });
  }
};

// Update an expenditure by ID
exports.updateExpenditureById = async (req, res) => {
  const { itemName, amount, spender, date } = req.body;
  try {
    const updatedExpenditure = await Expenditure.findByIdAndUpdate(
      req.params.id,
      { itemName, amount, spender, date },
      { new: true }
    );
    if (!updatedExpenditure) {
      return res.status(404).json({ message: 'Expenditure not found' });
    }
    res.json(updatedExpenditure);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expenditure', error });
  }
};

// Delete an expenditure by ID
exports.deleteExpenditureById = async (req, res) => {
  try {
    const deletedExpenditure = await Expenditure.findByIdAndDelete(req.params.id);
    if (!deletedExpenditure) {
      return res.status(404).json({ message: 'Expenditure not found' });
    }
    res.json({ message: 'Expenditure deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expenditure', error });
  }
};
