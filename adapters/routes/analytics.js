const express = require('express');
const router = express.Router();
const Mood = require('./../../infrastructure/db/mood_schema');

router.post("/add", async (req, res) => {

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

});

router.post("/previous_mood", async (req, res) => {
    const userid = req.body.userid;
    if (!userid) {
        return res.json({ mood: "happy" });
    }
    const latestMood = await Mood.findOne({ userid })
        .sort({ dateadded: -1 });

    if (!latestMood) {
        return res.json({ mood: "happy" });
    }
    return res.json({
        mood: latestMood.mood,
    });
})

router.post('/mood_distribution', async (req, res) => {
    const userid = req.body.userid;
    if (!userid) {
        return res.json({ anger: 0, happy: 0, fear: 0, anxiety: 0, sadness: 0, boredom: 0, excitement: 0 });
    }
    const totalEntries = await Mood.countDocuments({ userid });
    if (totalEntries === 0) {
        return res.json({ anger: 0, happy: 0, fear: 0, anxiety: 0, sadness: 0, boredom: 0, excitement: 0 });
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
        anger: perAnger, happy: perHappy.toFixed(2), fear: perFear.toFixed(2), anxiety: perAnxiety.toFixed(2), sadness: perSadness.toFixed(2), boredom: perBoredom.toFixed(2), excitement: perExcitement.toFixed(2)
    });
})

router.post('/feedback_percentage', async (req, res) => {
    const userid = req.body.userid;
    if (!userid) {
        return res.json({ message: "User ID is required" });
    }

    const totalEntries = await Mood.countDocuments({ userid });

    if (totalEntries === 0) {
        return res.json({ message: `No entries found for user ${userid}`, percentage: 0 });
    }

    const feelingBetterEntries = await Mood.countDocuments({ userid, feeling_better: true });

    const percentageFeelingBetter = (feelingBetterEntries / totalEntries) * 100;

    return res.json({
        message: `Percentage of times user ${userid} felt better`,
        percentage: percentageFeelingBetter.toFixed(2), // Format to 2 decimal places
    });
    // console.error("Error calculating percentage:", error);
    // res.json({ message: "Error calculating percentage", error: error.message });
});

module.exports = router;
