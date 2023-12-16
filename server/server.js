const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  // Add this line
const multer = require('multer');
const candidateRoutes = require('./routes/candidateRoutes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use('/candidates', candidateRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
