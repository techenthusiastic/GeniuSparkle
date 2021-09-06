const redisClient = require("../redisConnect");
const { RateLimiterRedis } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "allRequests",
	points: 25, // 25 requests
	duration: 1, // per 1 second by IP
});

const rateLimiterMiddleware = (req, res, next) => {
	const myIP = req.headers["x-forwarded-for"] || req.ip;
	rateLimiter
		.consume(myIP)
		.then(() => {
			next();
		})
		.catch(() => {
			if (req.method === "GET")
				res
					.status(429)
					.send(
						'<center><h1 style="color: orangered;font-family: monospace;">Crossed maximum attempts allowed.<br>Please retry after sometime.</h1></center>'
					);
			else
				res.status(429).send({
					error: { status: 429, message: "Crossed maximum attempts allowed" },
				});
		});
};
// Rate Limiter - SignIn attempts
// Block for specific IP - login blocked per email per IP ie for key email_IP
const signInLimiterIP = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "signInLimitIP",
	points: 5, // 5
	duration: 60 * 60 * 3, // store failure for 3hrs
	blockDuration: 60 * 15, // block for next 15mis
});
// Block for all IPs ie blocked by email
const signInLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "signInLimit",
	points: 100, // 100
	duration: 60 * 60 * 24, // store failure for 24hrs
	blockDuration: 60 * 60 * 24, // block for 1day
});
//
//
// Block for each IP
const loginAuthSendMailLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "registerMailLimit",
	points: 5, // 5
	duration: 60 * 60, // store failure for 1hr
	blockDuration: 60 * 15, // block for 15mins
});
module.exports = {
	rateLimiterMiddleware,
	signInLimiter,
	signInLimiterIP,
	loginAuthSendMailLimiter,
};
