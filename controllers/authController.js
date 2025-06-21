import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import db from "../database/db.js";
const SECRET = "your_jwt_secret";

export function signup(req, res) {
    const { username, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 10);
    db.run(
        `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
        [username, email, hashed],
        function (err) {
            if (err) return res.status(400).json({ message: 'Email already exists' });
            const user = { id: this.lastID, username, email };
            const token = jwt.sign(user, SECRET);
            res.json({ token, user });
        }
    );
}

export function login(req, res) {
    const { email, password } = req.body;
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user)
            return res.status(400).json({ error: "Invalid email" });
        if (!bcrypt.compareSync(password, user.password))
            return res.status(400).json({ error: "Invalid password" });
        const payload = { id: user.id, username: user.username, email: user.email };
        const token = jwt.sign(payload, SECRET);
        res.json({ token, user: payload });
    });
}
