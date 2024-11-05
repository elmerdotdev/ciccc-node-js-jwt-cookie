// src/index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { generateToken } from './auth';
import { authenticateJWT } from './middleware';

dotenv.config();

const app = express();
app.use(cors({ origin: 'http://localhost:4321', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Define the request body type for login
interface LoginRequestBody {
  username: string;
  password: string;
}

// Login Route
app.post('/login', (req: Request, res: Response) => {  // Explicitly type Response as Response<any>
  const { username, password } = req.body as LoginRequestBody;

  // Replace this with real user validation
  if (username === 'user' && password === 'password') {
    const token = generateToken({ id: 1, username });  // Explicitly type token as string

    // Send token as an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000, // 1 hour
    });
    res.json({ message: 'Login successful' });
    return
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// Logout Route
app.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout successful' });
});

// Protected Route
app.get('/protected', authenticateJWT, (req, res) => {
  console.log(req.user)
  res.json({ message: 'Protected route accessed', user: req.user });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
