const Quote = require('../models/quotationModel');
// Create a quote
exports.createQuote = async(req, res)=>{
    try {
        const {clientName, items, totalAmount} = req.body;
        const newQuote = new Quote({clientName, items, totalAmount});
        await newQuote.save();

        res.status(201).json({message: 'Quote created'});

    } catch (error) {
        res.status(500).json({error: err.message});
    }
    
}

// Get all Quotes
exports.getQuote = async(req, res)=>{
    try {
        const quotes = await Quote.find();
        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update a Quote
exports.updateQuote = async (req, res) =>{
    try {
        const quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if(!quote) return res.status(404).json({message: 'Quote not found'});
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

// Delete a quote
exports.deleteQuote = async(req, res)=>{
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if(!quote) return res.status(400).json({message: "Quote not found"});
        return(200).json({message: "Quote deleted successfully"});
    } catch (error) {
        
    }
}