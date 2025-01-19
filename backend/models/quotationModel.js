const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
    clientName: {type: String, required: true},
    clientAddress: {type: String, required: true},

    items: [
        {
            quantity: Number,
            description: String,
            rate: Number,
            amount: Number,
        }
    ],
    totalAmount: Number,
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Quote', QuoteSchema);