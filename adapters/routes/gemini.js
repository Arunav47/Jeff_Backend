const express = require('express');
const router = express.Router();
const gemini = require('./../../services/gemini.js');

router.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const chatbotResponse = await gemini.run(userMessage);
        res.json({ reply: chatbotResponse });
    } catch (error) {
        console.error('Error during chat:', error);
        res.status(500).json({ error: 'Something went wrong while processing the chat' });
    }
});

router.post('/mood', async (req, res) => {
    try {
        const userMood = req.body.mood;
        if (!userMood) {
            return res.status(400).json({ error: 'Mood is required' });
        }
        const chatbotResponse = await gemini.getQuote(userMood);
        res.json({ reply: chatbotResponse });
    } catch (error) {
        console.error('Error during mood:', error);
        res.status(500).json({ error: 'Something went wrong while processing the mood' });
    }
});

module.exports = router;
