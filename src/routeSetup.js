const router = require("express").Router();
// const createErr = require("http-errors");
// Facebook Routes
const fbRouter = require("./routes/login/fbLogin");
router.use("/facebook", fbRouter);
// Google Routes
const googleRouter = require("./routes/login/googleLogin");
router.use("/google", googleRouter);
// Email Authentication Route
const emailAuthRoute = require("./routes/login/emailLogin");
router.use("/emailAuth", emailAuthRoute);
module.exports = router;
