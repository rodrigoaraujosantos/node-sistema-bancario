const express = require('express');
const route = require('./routes/banco');
const app = express();
app.use(express.json());
app.use(route);
app.listen(8000);