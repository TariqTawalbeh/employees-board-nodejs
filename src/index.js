const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();

const userRoutes = require('../routes/users.js');
const { testConnection } = require('../config/database.js');
const config = require("../config/config");
testConnection();

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
