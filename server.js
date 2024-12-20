const express = require('express'); // Import express
const path = require('path');
const session = require('express-session'); // Tambahkan express-session
const { aiBtc } = require('./aiBtc');
const app = express(); 
const PORT = 3002; // Tentukan port

// Middleware untuk melayani file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware session untuk menyimpan data pengguna
app.use(session({
    secret: 'mySecretKey',  // Kunci rahasia untuk mengenkripsi session
    resave: false,          // Tidak menyimpan session jika tidak ada perubahan
    saveUninitialized: true // Simpan session walaupun belum ada data
}));

// Endpoint utama untuk menangani pertanyaan
app.get('/ask', async (req, res) => {
    const userMessage = req.query.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message query parameter is required' });
    }

    // Inisialisasi session jika belum ada
    if (!req.session.chatHistory) {
        req.session.chatHistory = [
            { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
        ];
    }

    try {
        // Tambahkan pesan pengguna ke dalam riwayat percakapan (session)
        req.session.chatHistory.push({ role: 'user', content: userMessage });

        // Siapkan pesan yang akan dikirim ke AI berdasarkan riwayat
        const messages = req.session.chatHistory;

        // Panggil AI untuk mendapatkan balasan berdasarkan riwayat percakapan
        const response = await aiBtc(messages);
        if (response && response.result) {
            // Tambahkan balasan dari AI ke dalam riwayat percakapan
            req.session.chatHistory.push({ role: 'assistant', content: response.result });

            // Kirim respons ke klien beserta balasan dari AI
            res.json({ response: response.result, history: req.session.chatHistory });
        } else {
            res.json({ error: 'Response tidak ditemukan dari API' });
        }
    } catch (error) {
        console.error('Error handling request:', error.message); // Log error untuk debugging
        res.status(500).json({ error: 'Error processing the request' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
