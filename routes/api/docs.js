const express = require('express');
const router = express.Router();
const docsCtrl = require('../../controllers/api/docs');

// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// READ: 
// router.get('/check-token', ensureLoggedIn, docsCtrl.checkToken);


// UPDATE:
router.post('/create', docsCtrl.createDoc)
router.post('/:docId/update', docsCtrl.updateDoc)
router.post('/delete', docsCtrl.deleteDoc)

// GET
router.get('/:docId', docsCtrl.getDoc)
router.get('/', docsCtrl.index)

module.exports = router;
