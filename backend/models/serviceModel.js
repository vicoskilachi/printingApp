const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  cost: { type: Number, required: true },
  payment: {type: Number, required: true},
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  providerName: {type: String, required: true},
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Service', serviceSchema);
