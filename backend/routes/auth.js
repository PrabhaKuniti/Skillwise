const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register - Register a new user
router.post('/register', [
  body('username').notEmpty().withMessage('Username is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], (err, existing) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (existing) {
        return res.status(400).json({ error: 'User with this email or username already exists' });
      }

      // Hash password
      bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error('Hash error:', hashErr);
          return res.status(500).json({ error: 'Error hashing password' });
        }

        // Insert user
        db.run(
          'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
          [username, email, hashedPassword],
          function(insertErr) {
            if (insertErr) {
              console.error('Insert error:', insertErr);
              return res.status(500).json({ error: insertErr.message });
            }

            // Generate JWT token
            const token = jwt.sign(
              { id: this.lastID, username, email },
              JWT_SECRET,
              { expiresIn: '24h' }
            );

            res.status(201).json({
              message: 'User registered successfully',
              token,
              user: {
                id: this.lastID,
                username,
                email
              }
            });
          }
        );
      });
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// POST /api/auth/login - Login user
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user by email
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: err.message });
      }
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Compare password
      bcrypt.compare(password, user.password, (compareErr, isValidPassword) => {
        if (compareErr) {
          console.error('Compare error:', compareErr);
          return res.status(500).json({ error: 'Error verifying password' });
        }
        
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, username: user.username, email: user.email },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email
          }
        });
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

module.exports = router;

