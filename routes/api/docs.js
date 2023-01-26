const express = require('express');
const router = express.Router();
const docsCtrl = require('../../controllers/api/docs');

// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// READ: 
// router.get('/check-token', ensureLoggedIn, docsCtrl.checkToken);


// UPDATE:
router.post('/create', docsCtrl.createDoc)
router.post('/:docId/update', ensureLoggedIn, docsCtrl.updateDoc)
router.post('/delete', ensureLoggedIn, docsCtrl.deleteDoc)

// GET
router.get('/:docId', ensureLoggedIn, docsCtrl.getDoc)
router.get('/', ensureLoggedIn, docsCtrl.index)

module.exports = router;
