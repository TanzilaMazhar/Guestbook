const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");
const app = express();

const port = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(express.json());

// GET all messages
app.get("/api/messages", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM messages ORDER BY created_at DESC");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while fetching messages" });
    }
});

//POST new message
app.post("/api/messages", async (req, res) => {
    try {
        const { name, text } = req.body;
        if (!name || !text) {
            return res.status(400).json({ error: "Name and text are required" });
        }
        if (name.length > 100) {
            return res.status(400).json({ error: "Name must be under 100 characters" });
        }

        const result = await pool.query(
            "INSERT INTO messages (name, text) VALUES ($1, $2) RETURNING *",
            [name.trim(), text.trim()]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while creating message" });
    }
});

// 3) UPDATE message
app.put("/api/messages/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: "Text is required for update" });
        }

        const result = await pool.query(
            "UPDATE messages SET text = $1 WHERE id = $2 RETURNING *",
            [text.trim(), id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while updating message" });
    }
});

// 4) DELETE message
app.delete("/api/messages/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM messages WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Message not found" });
        }

        res.json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Server error while deleting message" });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
