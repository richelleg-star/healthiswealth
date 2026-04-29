const express = require('express');
const cors = require('cors');
const { translate } = require('@vitalets/google-translate-api');

const app = express();
app.use(cors()); // Lets React app talk to this server
app.use(express.json());

// The translation endpoint
app.post('/api/translate', async (req, res) => {
    try {
        const { text, target } = req.body;
        
        // Ask Google for the translation
        const result = await translate(text, { to: target });
        
        // Send the translated text straight back to React
        res.status(200).json({ translatedText: result.text });

    } catch (error) {
        console.error("Translation error:", error);
        res.status(500).json({ error: "Failed to translate" });
    }
});

app.listen(5000, () => console.log('Backend running on port 5000'));