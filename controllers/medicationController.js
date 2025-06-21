import db from "../database/db.js";

export function addMedication(req, res) {
    const { name, dosage, frequency } = req.body;
    const user_id = req.user.id;
    db.run(
        `INSERT INTO medications (user_id, name, dosage, frequency) VALUES (?, ?, ?, ?)`,
        [user_id, name, dosage, frequency],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ id: this.lastID });
        }
    );
}

export function getMedications(req, res) {
    const user_id = req.user.id;
    db.all(
        `SELECT * FROM medications WHERE user_id = ?`,
        [user_id],
        (err, rows) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json(rows);
        }
    );
}

export function markTaken(req, res) {
    db.run(
        `UPDATE medications SET taken = 1 WHERE id = ? AND user_id = ?`,
        [req.params.id, req.user.id],
        function (err) {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ updated: this.changes });
        }
    );
}

