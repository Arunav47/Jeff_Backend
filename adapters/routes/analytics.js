const express = require('express');
const router = express.Router();
const Mood = require('./../../infrastructure/db/mood_schema');

router.post("/add", async (req, res) => {
    try {
        await Mood.deleteOne({ id: req.body.id });
        const newMood = new Mood({
            id: req.body.id,
            userid: req.body.userid,
            mood: req.body.mood,
            feeling_better: req.body.feeling_better,
        });
        await newMood.save();

        const response = { message: "New mood Created! " + `id: ${req.body.id}` };
        res.json(response);
    } catch (error) {
        console.error("Error adding mood:", error);
        res.status(500).json({ message: "Error adding mood", error: error.message });
    }
});

router.post("/previous_mood", async (req, res) => {
    try {
        const userid = req.body.userid;
        if (!userid) {
            return res.json({ mood: "happy" });
        }
        const latestMood = await Mood.findOne({ userid }).sort({ dateadded: -1 });

        if (!latestMood) {
            return res.json({ mood: "happy" });
        }
        return res.json({ mood: latestMood.mood });
    } catch (error) {
        console.error("Error fetching previous mood:", error);
        res.status(500).json({ message: "Error fetching previous mood", error: error.message });
    }
});

router.post('/mood_distribution', async (req, res) => {
    try {
        const userid = req.body.userid;
        if (!userid) {
            return res.json({ anger: "0.00", happy: "0.00", fear: "0.00", anxiety: "0.00", sadness: "0.00", boredom: "0.00", excitement: "0.00" });
        }
        const totalEntries = await Mood.countDocuments({ userid });
        if (totalEntries === 0) {
            return res.json({ anger: "0.00", happy: "0.00", fear: "0.00", anxiety: "0.00", sadness: "0.00", boredom: "0.00", excitement: "0.00" });
        }
        const anger = await Mood.countDocuments({ userid, mood: "anger" });
        const happy = await Mood.countDocuments({ userid, mood: "happy" });
        const fear = await Mood.countDocuments({ userid, mood: "fear" });
        const anxiety = await Mood.countDocuments({ userid, mood: "anxiety" });
        const sadness = await Mood.countDocuments({ userid, mood: "sadness" });
        const boredom = await Mood.countDocuments({ userid, mood: "boredom" });
        const excitement = await Mood.countDocuments({ userid, mood: "excitement" });

        const perAnger = (anger / totalEntries) * 100;
        const perHappy = (happy / totalEntries) * 100;
        const perFear = (fear / totalEntries) * 100;
        const perAnxiety = (anxiety / totalEntries) * 100;
        const perSadness = (sadness / totalEntries) * 100;
        const perBoredom = (boredom / totalEntries) * 100;
        const perExcitement = (excitement / totalEntries) * 100;

        return res.json({
            anger: perAnger.toFixed(2), happy: perHappy.toFixed(2), fear: perFear.toFixed(2), anxiety: perAnxiety.toFixed(2),
            sadness: perSadness.toFixed(2), boredom: perBoredom.toFixed(2), excitement: perExcitement.toFixed(2)
        });
    } catch (error) {
        console.error("Error calculating mood distribution:", error);
        res.status(500).json({ message: "Error calculating mood distribution", error: error.message });
    }
});

router.post('/feedback_percentage', async (req, res) => {
    try {
        const userid = req.body.userid;
        if (!userid) {
            return res.json({ message: "User ID is required"});
        }

        const totalEntries = await Mood.countDocuments({ userid });

        if (totalEntries === 0) {
            return res.json({percentage_not_better: "0.00", percentage_not_better: "0.00"});
        }

        const feelingBetterEntries = await Mood.countDocuments({ userid, feeling_better: true });
        const feelingNotBetterEntries = await Mood.countDocuments({ userid, feeling_better: false });

        const percentageFeelingBetter = (feelingBetterEntries / totalEntries) * 100;
        const percentageFeelingNotBetter = (feelingNotBetterEntries / totalEntries) * 100;

        return res.json({
            percentage_better: percentageFeelingBetter.toFixed(2), // Format to 2 decimal places
            percentage_not_better: percentageFeelingNotBetter.toFixed(2), // Format to 2 decimal places
        });
    } catch (error) {
        console.error("Error calculating feedback percentage:", error);
        res.status(500).json({ message: "Error calculating feedback percentage", error: error.message });
    }
});

module.exports = router;
