const express = require('express');
const crouter = express.Router();

const Journal = require('./../../infrastructure/db/journal_schema');

router.post("/list", async function(req, res) {
    var Journals = await Journal.find({ userid: req.body.userid });
    res.json(Journals);
});

router.post("/add", async function(req, res) {       
    
    await Journal.deleteOne({ id: req.body.id });

    const newJournal = new Journal({
        id: req.body.id,
        userid: req.body.userid,
        title: req.body.title,
        content: req.body.content
    });
    await newJournal.save();

    const response = { message: "New Journal Created! " + `id: ${req.body.id}` };
    res.json(response);

});

router.post("/delete", async function(req, res) {
    await Journal.deleteOne({ id: req.body.id });
    const response = { message: "Journal Deleted! " + `id: ${req.body.id}` };
    res.json(response);
});

module.exports = router;