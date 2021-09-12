const router = require("express").Router();
//
const controller = require("./../../controllers/login/twitterLogin");
//
router.get("/requestToken", controller.handleRequestToken);
//
router.get("/authenticate", controller.handleAuthenticate);
//
module.exports = router;
