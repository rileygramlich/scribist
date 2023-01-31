const express = require('express');
const router = express.Router();
const docsCtrl = require('../../controllers/api/docs');

// Middleware functions
const ensureLoggedIn = require('../../config/ensureLoggedIn');

// UPDATE:
router.post('/create', docsCtrl.createDoc)
router.post('/:docId/update', docsCtrl.updateDoc)
router.post('/delete',  docsCtrl.deleteDoc)

// GET
router.get('/:docId', docsCtrl.getDoc)
router.get('/', docsCtrl.index)

module.exports = router;
