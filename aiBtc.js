const axios = require('axios');

// Ganti dengan API Key kamu
const API_KEY = 'lia';

async function aiBtc(message) {
    try {
        const params = {
            message: message,
            apikey: API_KEY
        };
        const { data } = await axios.post('https://api.botcahx.eu.org/api/search/openai-custom', params);
        console.log("API Response:", data); // Tambahkan log ini untuk melihat respons dari API
        return data;
    } catch (error) {
        console.error("Error during API request:", error.message); // Log detail error
        throw new Error(error);
    }
}

module.exports = { aiBtc };
