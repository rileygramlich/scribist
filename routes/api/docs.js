const express = require('express');
const router = express.Router();
const docsCtrl = require('../../controllers/api/docs');

// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// POST /api/docs
router.post('/', docsCtrl.create)

// GET /api/docs/check-token
// router.get('/check-token', ensureLoggedIn, docsCtrl.checkToken);

module.exports = router;
