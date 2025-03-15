const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors()); // Sudah cukup tanpa tambahan { origin: "*" }
app.use(bodyParser.json());

// Konfigurasi koneksi ke MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Ganti dengan username MySQL kamu
    password: "", // Jika ada password, isi di sini
    database: "portfolio_db",
});

// Cek koneksi ke database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database!");
});

// Route untuk menerima data kontak dan menyimpan ke database
app.post("/contact", (req, res) => {
    console.log("Request diterima:", req.body); // Log untuk debugging

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: "Semua field harus diisi!" });
    }

    const sql = "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)";
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ message: "Gagal menyimpan pesan!" });
        }
        res.json({ message: "Pesan berhasil dikirim!" });
    });
});

// Jalankan server di port 3000
app.listen(3000, () => {
    console.log("Server berjalan di http://localhost:3000");
});
