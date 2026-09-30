const router = require("express").Router();
const docsCtrl = require("../../controllers/api/docs");

router.get("/", docsCtrl.index);
router.post("/", docsCtrl.create);
router.get("/:docId", docsCtrl.show);
router.patch("/:docId", docsCtrl.rename);
router.delete("/:docId", docsCtrl.remove);

module.exports = router;
