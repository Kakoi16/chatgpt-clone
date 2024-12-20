const { aiBtc } = require('../../aiBtc'); // Sesuaikan path file aiBtc.js

exports.handler = async function(event, context) {
    const userMessage = event.queryStringParameters.message;

    if (!userMessage) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Message query parameter is required' })
        };
    }

    try {
        const messages = [
            { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
            { role: "assistant", content: "Kamu adalah plana, murid dari sensei blue archive..." },
            { role: "user", content: userMessage },
        ];

        const response = await aiBtc(messages);
        if (response && response.result) {
            return {
                statusCode: 200,
                body: JSON.stringify({ response: response.result })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Response tidak ditemukan dari API' })
            };
        }
    } catch (error) {
        console.error('Error handling request:', error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error processing the request' })
        };
    }
};
