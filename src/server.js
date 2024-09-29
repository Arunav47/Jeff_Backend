// Initialization
const express = require('express');
const app = express();

const mongoose = require('mongoose');
const Journal = require('./../infrastructure/db/journal_schema');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongoDbPath = "mongodb+srv://majumdersubham14082003:missionjeff@cluster0.lcdh6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoDbPath).then(function() {
    app.get("/", function(req, res) {
        const response = { statuscode: res.statusCode, message: "API Works!" };
        res.json(response);
    });
    
    const JournalRouter = require('./../adapters/routes/journal');
    app.use("/Journals", JournalRouter);
});

// Starting the server on a PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
    console.log("Server started at PORT: " + PORT);
});