const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const serviceRoutes = require('./routes/serviceRoutes');
const expenditureRoutes = require('./routes/expenditureRoutes');
const todoRoutes = require('./routes/todoRoutes');
const quotationRoutes = require('./routes/quotationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/expenditures', expenditureRoutes );
app.use('/api/todos', todoRoutes);
app.use('/api/quotation', quotationRoutes);

module.exports = app;
