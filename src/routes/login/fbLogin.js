const router = require("express").Router();
const handleFbOAuthResp = require("./../../controllers/login/fbLogin");
router.get("/authenticate", handleFbOAuthResp);
module.exports = router;
