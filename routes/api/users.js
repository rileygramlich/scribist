// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// routes/api/users.js

const express = require('express');
const router = express.Router();
const usersCtrl = require('../../controllers/api/users');

// POST /api/users
router.post('/login', usersCtrl.login)
router.post('/', usersCtrl.create);

// GET /api/users/check-token
router.get('/check-token', ensureLoggedIn, usersCtrl.checkToken);

module.exports = router;
