const router = require("express").Router();
const handleGoogleOAuthResp = require("./../../controllers/login/googleLogin");
router.get("/login", handleGoogleOAuthResp);
module.exports = router;
