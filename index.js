const express = require("express");
const createErr = require("http-errors");
require("dotenv").config();
const app = express();
// Set ejs as view engine
app.set("view engine", "ejs");
//
const morgan = require("morgan");
app.use(morgan("dev"));
//
const cors = require("cors");
app.use(cors({ origin: true, credentials: true }));
//
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Rate Limiter
// const {
// 	rateLimiterMiddleware,
// } = require("./src/helpers/rateLimiter/rateLimiter");
// app.use(rateLimiterMiddleware);
//
app.use(express.static(__dirname + "/public"));
//
app.use(require("./src/routeSetup"));
//
// app.get("/", (req, res, next) => {
// 	// res.send("Test Success");
// 	res.render("index", { user: "Sachin" });
// 	// res.writeHead(200, { "content-type": "text/html" });
// 	// fs.createReadStream("./public/index.html").pipe(res);
// });
// Error out if no Router Exists
app.use(async (req, res, next) => {
	next(createErr.NotFound());
});
const {
	storeErr,
	defaultErrMsgTxt,
} = require("./src/helpers/utllity/storeErr");
// Error Handeler Middleware
app.use((err, req, res, next) => {
	let showErr =
		typeof err.message !== "object" ? err.message : defaultErrMsgTxt;
	res
		.status(err.status || 500)
		.send({ error: { status: err.status || 500, message: showErr } });
});
//
const http = require("http");
const httpServer = http.Server(app);
//
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, function () {
	console.log(`Server Running on Port ${PORT}`);
});
