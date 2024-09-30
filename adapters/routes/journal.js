const express = require('express');
const router = express.Router();

const Journal = require('./../../infrastructure/db/journal_schema');

// List Journals
router.post("/list", async function(req, res) {
    try {
        var Journals = await Journal.find({ userid: req.body.userid });
        res.json(Journals);
    } catch (error) {
        res.status(500).json({ message: "Error fetching journals", error: error.message });
    }
});

// Add Journal
router.post("/add", async function(req, res) {       
    try {
        // Delete existing journal with the same id if exists
        await Journal.deleteOne({ id: req.body.id });

        // Create new journal
        const newJournal = new Journal({
            id: req.body.id,
            userid: req.body.userid,
            title: req.body.title,
            content: req.body.content
        });

        await newJournal.save();
        const response = { message: "New Journal Created! " + `id: ${req.body.id}` };
        res.json(response);

    } catch (error) {
        res.status(500).json({ message: "Error creating journal", error: error.message });
    }
});

// Delete Journal
router.post("/delete", async function(req, res) {
    try {
        await Journal.deleteOne({ id: req.body.id });
        const response = { message: "Journal Deleted! " + `id: ${req.body.id}` };
        res.json(response);
    } catch (error) {
        res.status(500).json({ message: "Error deleting journal", error: error.message });
    }
});

module.exports = router;
