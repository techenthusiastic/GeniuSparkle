const createErr = require("http-errors");
//
const bcrypt = require("bcrypt");
const saltRounds = 10;
//
const {
	storeErr,
	defaultErrMsg,
	getIP,
} = require("./../../helpers/utllity/storeErr");
// Import all joiSchema Validations
const {
	signInV,
	initRegisterV,
	verifyLinkMailV,
	resetPswdV,
} = require("./../../helpers/joiSchema/emailLogin");
const { emailV } = require("./../../helpers/joiSchema/frequentUsage");
// Import all SQL_Models
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
const sent_mails_Mdl = require("./../../helpers/sql/models/email_Mdl");
// Import Rate Limiter
// const {
// 	loginAuthSendMailLimiter,
// 	signInLimiter,
// 	signInLimiterIP,
// } = require("./../../helpers/rateLimiter/rateLimiter");
//
const mailPrepare = require("./../../mailing/mailPrepare");
const processLogin = require("../../app/processLogin");
//
const handleInitRegister = async (req, res, next) => {
	let reqBody;
	try {
		reqBody = await initRegisterV.validateAsync(req.body);
		// Check for Rate Limiter Data
		let retrySecs = 0;
		const myIP = await getIP(req);
		// Get Number of Verification Mailer Requests in last 15mins from this IP
		// const failsM = await loginAuthSendMailLimiter.get(myIP);
		// if (failsM !== null && failsM.consumedPoints > 4)
		// 	retrySecs = Math.round(failsM.msBeforeNext / 1000) || 1;
		// Check if limit is already crossed
		if (retrySecs > 0) {
			const show = Math.ceil(retrySecs / 60);
			return next(
				createErr.TooManyRequests(
					"Crossed maximum allowed attempts.<br>Retry-after " +
						(show > 1 ? show + " mins" : retrySecs + " secs")
				)
			);
		}
		// Update total number of verification mail requests till now
		// await loginAuthSendMailLimiter.consume(myIP);
		// Process Initiate Register
		const is_Found = await credentialsMdl.findOne({
			attributes: ["id"],
			where: { email: reqBody.email },
		});
		if (is_Found)
			return next(
				createErr.Conflict(
					"Account already exists for this e-Mail.<br>Please Log-In."
				)
			);
		else {
			// Send a Verification Mail and store the mail in sent_mails_Database
			try {
				const status = reqBody.isMinor
					? { sendSuccess: true }
					: await mailPrepare(reqBody.email, 1);
				if (status.sendSuccess) {
					const hashedPswd = await bcrypt.hash(reqBody.password, saltRounds);
					if (hashedPswd) {
						const created_User = await credentialsMdl.create({
							email: reqBody.email,
							password: hashedPswd,
							name: reqBody.name,
							gender: reqBody.gender,
							dob: reqBody.dob,
							isMinor: reqBody.isMinor ? 1 : 0,
						});
						if (created_User)
							res.json({ status: "success", sentTo: reqBody.email });
						else {
							storeErr(
								reqBody,
								"Error: New User Insert Query Failed : /initRegister",
								req
							);
							return next(
								createErr.ServiceUnavailable(
									"This service is currently down.<br>Sorry for the inconvenience caused.<br>Please try again later."
								)
							);
						}
					} else {
						storeErr(reqBody, "Error: Hash Password generate Failed.", req);
						return next(
							createErr.ServiceUnavailable(
								"This service is currently down.<br>Sorry for the inconvenience caused.<br>Please try again later."
							)
						);
					}
				} else
					return next(
						createErr.InternalServerError(
							"Something went wrong.Request couldn't be placed at the moment"
						)
					);
			} catch (err) {
				return next(
					createErr.InternalServerError(
						err
							? err
							: "Something went wrong. Request couldn't be placed at the moment.<br>Please try again later."
					)
				);
			}
		}
	} catch (error) {
		if (error.isJoi) error.status = 422;
		else storeErr(reqBody, error, req);
		next(error);
	}
};
//
const handleMailVerification = async (req, res, next) => {
	let reqParam = req.params;
	try {
		reqParam = await verifyLinkMailV.validateAsync(reqParam);
		const sent_mails = await sent_mails_Mdl.findOne({
			attributes: ["sentFor", "action_used", "validTill"],
			where: { email: reqParam.email, uuid: reqParam.mailUID },
		});
		if (sent_mails) {
			const dataValues = sent_mails.dataValues;
			const now = Date.now();
			if (
				dataValues.action_used ||
				!dataValues.validTill ||
				now - dataValues.validTill > 0
			)
				return res
					.status(409)
					.send(
						'<center><h1 style="color: orangered;font-family: monospace;">Link has already been used or it has Expired : Request new Link</h1></center>'
					);
			//
			const status = await credentialsMdl.update(
				{ status: 1 },
				{ where: { email: reqParam.email } }
			);
			if (!status)
				return res
					.status(500)
					.send(
						'<center><h1 style="color: orangered;font-family: monospace;">Invalid Verification URL.</h1></center>'
					);
			//
			if (reqParam.action === "register" && dataValues.sentFor === "signup") {
				const status = await credentialsMdl.update(
					{ status: 1 },
					{ where: { email: reqParam.email } }
				);
				if (status) {
					sent_mails_Mdl.update(
						{ action_used: 1 },
						{
							where: { email: reqParam.email, uuid: reqParam.mailUID },
						}
					);
					const user_Info = {
						email: reqParam.email,
						loginCode: 4,
					};
					const loginDataJSON = await processLogin(user_Info);
					res.render("setLocalStoreRedirect", {
						browserStore: { key: "token", value: loginDataJSON },
						redirectURL: "/",
					});
				} else return res.status(401).send(defaultErrMsg);
			} else if (
				reqParam.action === "resetpswd" &&
				dataValues.sentFor === "resetpswd"
			) {
				const obj = { mailUID: reqParam.mailUID, email: reqParam.email };
				const jsonObj = JSON.stringify(obj);
				res.render("setLocalStoreRedirect", {
					browserStore: { key: "dataForReset", value: jsonObj },
					redirectURL: "/signin-and-signup.html?resetPswd=true",
				});
			}
		} else
			return res
				.status(500)
				.send(
					'<center><h1 style="color: orangered;font-family: monospace;">Invalid Verification URL.</h1></center>'
				);
	} catch (error) {
		console.log(error);
		if (error.isJoi)
			res
				.status(422)
				.send(
					'<center><h1 style="color: orangered;font-family: monospace;">Invalid Verification URL.</h1></center>'
				);
		else {
			storeErr(reqParam, error, req);
			res.status(422).send(defaultErrMsg);
		}
	}
};
//
const handleForgotPassword = async (req, res, next) => {
	let reqBody;
	try {
		reqBody = await emailV.validateAsync(req.body);
		// Check for Rate Limiter Data
		let retrySecs = 0;
		const myIP = await getIP(req);
		// Get Number of Verification Mailer Requests in last 15mins from this IP
		// const failsM = await loginAuthSendMailLimiter.get(myIP);
		// if (failsM !== null && failsM.consumedPoints > 4)
		// 	retrySecs = Math.round(failsM.msBeforeNext / 1000) || 1;
		// Check if limit is already crossed
		if (retrySecs > 0) {
			const show = Math.ceil(retrySecs / 60);
			return next(
				createErr.TooManyRequests(
					"Crossed maximum allowed attempts.<br>Retry-after " +
						(show > 1 ? show + " mins" : retrySecs + " secs")
				)
			);
		}
		// Update total number of verification mail requests till now
		// await loginAuthSendMailLimiter.consume(myIP);
		// Process Initiate Register
		//
		const is_Found = await credentialsMdl.findOne({
			attributes: ["id"],
			where: { email: reqBody.email },
		});
		if (!is_Found)
			return next(
				createErr.Conflict(
					"No Account exists for this e-Mail.<br>Please Register using Join Now button."
				)
			);
		else {
			// Send a Verification Mail and store the mail in sent_mails_Database
			try {
				const status = await mailPrepare(reqBody.email, 2);
				if (status.sendSuccess)
					return res.json({ status: "success", sentTo: reqBody.email });
				else
					return next(
						createErr.InternalServerError(
							"Something went wrong.Request couldn't be placed at the moment"
						)
					);
			} catch (err) {
				return next(
					createErr.InternalServerError(
						err
							? err
							: "Something went wrong. Request couldn't be placed at the moment.<br>Please try again later."
					)
				);
			}
		}
	} catch (error) {
		console.log(error);
		if (error.isJoi) error.status = 422;
		else storeErr(reqBody, error, req);
		next(error);
	}
};
//
const handleResetPassword = async (req, res, next) => {
	let reqBody;
	try {
		reqBody = await resetPswdV.validateAsync(req.body);
		//
		const sent_mails = await sent_mails_Mdl.findOne({
			attributes: ["sentFor", "action_used", "validTill"],
			where: { email: reqBody.email, uuid: reqBody.mailUID },
		});
		if (sent_mails) {
			const dataValues = sent_mails.dataValues;
			const now = Date.now();
			if (
				dataValues.action_used ||
				!dataValues.validTill ||
				now - dataValues.validTill > 0
			)
				return next(
					createErr.Conflict(
						"Link has already been used or it has Expired : Request new Link"
					)
				);
			//
			if (dataValues.sentFor === "resetpswd") {
				const hashedPswd = await bcrypt.hash(reqBody.password, saltRounds);
				if (hashedPswd) {
					const update_Pswd = await credentialsMdl.update(
						{
							password: hashedPswd,
						},
						{ where: { email: reqBody.email } }
					);
					if (update_Pswd) {
						sent_mails_Mdl.update(
							{ action_used: 1 },
							{
								where: { email: reqBody.email, uuid: reqBody.mailUID },
							}
						);
						const user_Info = {
							email: reqBody.email,
							loginCode: 4,
						};
						const loginDataObj = await processLogin(user_Info, false);
						res.json({ status: "success", token: loginDataObj });
					} else
						return next(createErr.InternalServerError("Something went wrong"));
				} else {
					storeErr(reqBody, "Error: Hash Password generate Failed.", req);
					return next(
						createErr.ServiceUnavailable(
							"This service is currently down.<br>Sorry for the inconvenience caused.<br>Please try again later."
						)
					);
				}
			} else
				return res
					.status(500)
					.send(
						'<center><h1 style="color: orangered;font-family: monospace;">Invalid Verification URL.</h1></center>'
					);
		} else
			return res
				.status(500)
				.send(
					'<center><h1 style="color: orangered;font-family: monospace;">Invalid Verification URL.</h1></center>'
				);
	} catch (error) {
		console.log(error);
		if (error.isJoi) error.status = 422;
		else storeErr(reqBody, error, req);
		next(error);
	}
};
//
const handleEmailLogin = async (req, res, next) => {
	let reqBody;
	try {
		reqBody = await signInV.validateAsync(req.body);
		// Check for Rate Limiter Data
		const myIP = await getIP(req);
		const ipUnameKey = `${reqBody.email}_${myIP}`;
		// Get Failed attempts if any
		// const [fails, failsIP] = await Promise.all([
		// 	signInLimiter.get(reqBody.email),
		// 	signInLimiterIP.get(ipUnameKey),
		// ]);
		let retrySecs = 0;
		// Block each username per IP - small blocks
		// if (failsIP !== null && failsIP.consumedPoints > 4)
		// 	retrySecs = Math.round(failsIP.msBeforeNext / 1000) || 1;
		// // Block username for all IPs Large Block
		// else if (fails !== null && fails.consumedPoints > 99)
		// 	retrySecs = Math.round(fails.msBeforeNext / 1000) || 1;
		//
		if (retrySecs > 0) {
			const show = Math.ceil(retrySecs / 60);
			return next(
				createErr.TooManyRequests(
					"Crossed maximum allowed attempts.<br>Retry-after " +
						(show > 1 ? show + " mins" : retrySecs + " secs")
				)
			);
		}
		const credentials = await credentialsMdl.findOne({
			attributes: ["id", "email", "password", "isMinor"],
			where: { email: reqBody.email },
		});
		if (credentials) {
			const pswdVerify = await bcrypt.compare(
				reqBody.password,
				credentials.password
			);
			if (pswdVerify === true && credentials.isMinor) {
				// Consume one Failed Attempt for both
				// await Promise.all([
				// 	signInLimiter.consume(reqBody.email),
				// 	signInLimiterIP.consume(ipUnameKey),
				// ]);
				//
				const failsIP = false;
				return next(
					createErr.Unauthorized(
						"User is Minor.<br>Parental Consent Needed.<br>Please Contact Us."
					)
				);
			} else if (pswdVerify === true) {
				// Delete Failure Couting for unameIP only - Reset on successful authorisation
				// await not needed
				// if (failsIP !== null && failsIP.consumedPoints > 0)
				// 	signInLimiterIP.delete(ipUnameKey);
				//
				const user_Info = {
					email: reqBody.email,
					loginCode: 4,
				};
				const loginDataObj = await processLogin(user_Info, false);
				return res.json({ status: "success", token: loginDataObj });
			} else {
				// Consume one Failed Attempt for both
				// await Promise.all([
				// 	signInLimiter.consume(reqBody.email),
				// 	signInLimiterIP.consume(ipUnameKey),
				// ]);
				//
				const failsIP = false;
				return next(
					createErr.Unauthorized(
						`Invalid Username/Password.<br>${
							failsIP ? failsIP.remainingPoints - 1 : 4
						} attempts left`
					)
				);
			}
		} else {
			// Consume one Failed Attempt - if user doesn't exists consume for uname only not uname_IP
			// await signInLimiter.consume(reqBody.email);
			const failsIP = false;
			return next(
				createErr.Unauthorized(
					`Invalid Username/Password.<br>${
						failsIP ? failsIP.remainingPoints - 1 : 4
					} attempts left`
				)
			);
		}
		//
	} catch (error) {
		console.log(error);
		if (error.isJoi) error.status = 422;
		else storeErr(reqBody, error, req);
		next(error);
	}
};
module.exports = {
	handleInitRegister,
	handleMailVerification,
	handleForgotPassword,
	handleResetPassword,
	handleEmailLogin,
};
