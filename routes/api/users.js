const router = require("express").Router();
const usersCtrl = require("../../controllers/api/users");

router.get("/config", usersCtrl.config);
router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
router.post("/google", usersCtrl.googleLogin);

module.exports = router;
