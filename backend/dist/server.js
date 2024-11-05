"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = require("./auth");
const middleware_1 = require("./middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: 'http://localhost:4321', credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Login Route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Replace this with real user validation
    if (username === 'user' && password === 'password') {
        const token = (0, auth_1.generateToken)({ id: 1, username }); // Explicitly type token as string
        // Send token as an HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000, // 1 hour
        });
        res.json({ message: 'Login successful' });
        return;
    }
    res.status(401).json({ message: 'Invalid credentials' });
});
// Logout Route
app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
});
// Protected Route
app.get('/protected', middleware_1.authenticateJWT, (req, res) => {
    console.log(req.user);
    res.json({ message: 'Protected route accessed', user: req.user });
});
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
