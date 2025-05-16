const express = require('express');
const productRoutes = require('./routes/productRoute');

const app = express();

app.use('/', productRoutes);

module.exports = app; 