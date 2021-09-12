const router = require("express").Router();
//
const controller = require("./../../controllers/login/emailLogin");
// Resiter using Email
// Initiate email Registration - JoinNow
router.post("/initRegister", controller.handleInitRegister);
// Account Verification Using Email
router.get("/:action/:email/:mailUID", controller.handleMailVerification);
// Forgot Password
// Reset using Email Verfication Link
// Initiate Email Send
router.post("/forgotPswd", controller.handleForgotPassword);
// Reset Password
router.post("/resetPswd", controller.handleResetPassword);
// Sign In Route
router.post("/login", controller.handleEmailLogin);
module.exports = router;
