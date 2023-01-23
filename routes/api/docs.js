const express = require('express');
const router = express.Router();
const docsCtrl = require('../../controllers/api/docs');

// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// READ: 
// router.get('/check-token', ensureLoggedIn, docsCtrl.checkToken);


// UPDATE:
router.post('/create', docsCtrl.createDoc)

// GET
router.get('/', docsCtrl.index)

module.exports = router;
