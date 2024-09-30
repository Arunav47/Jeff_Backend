// Initialization
const express = require('express');
const app = express();

const mongoose = require('mongoose');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoDbPath = process.env.MONGO_URL;
mongoose.connect(mongoDbPath).then(function() {
    app.get("/", function(req, res) {
        const response = { statuscode: res.statusCode, message: "API Works!" };
        res.json(response);
    });

    const AnalyticsRouter= require('./../adapters/routes/analytics');
    const JournalRouter = require('./../adapters/routes/journal');
    const GeminiRouter = require('./../adapters/routes/gemini');

    app.use("/Gemini", GeminiRouter);
    app.use("/Journals", JournalRouter);
    app.use("/Analytics",AnalyticsRouter);
});

// Starting the server on a PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Server started at PORT: " + PORT);
});