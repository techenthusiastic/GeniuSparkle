const router = require("express").Router();
// const createErr = require("http-errors");
// Facebook Routes
const fbRouter = require("./routes/login/fbLogin");
router.use("/facebook", fbRouter);
// Google Routes
const googleRouter = require("./routes/login/googleLogin");
router.use("/google", googleRouter);
// Twitter Authentication Route
const twitterRouter = require("./routes/login/twitterLogin");
router.use("/twitter", twitterRouter);
// Email Authentication Route
const emailAuthRoute = require("./routes/login/emailLogin");
router.use("/emailAuth", emailAuthRoute);
// YouTube Route Setup
const YouTubeRoute = require("./routes/YouTube");
router.use("/youtube", YouTubeRoute);
// Get Country from IP
// const getCountryRoute = require("./routes/utilities/ipToCountry");
// router.use("/getCountry", getCountryRoute);
module.exports = router;
