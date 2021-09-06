const router = require("express").Router();
//
const { getGoogleAccountFromCode } = require("./../../loginAuths/googleLogin");
//
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
const socialSignUp = require("./../../routes/login/socialAcntCreate");
const processLogin = require("../../loginAuths/processLogin");
const { storeErr, defaultErrMsg } = require("../../helpers/utllity/storeErr");
//
router.get("/login", async (req, res) => {
	try {
		const query = req.query;
		if (!query.code)
			return res
				.status(401)
				.send(
					'<center><h1 style="color: orangered;font-family: monospace;">Invalid Response Received from Google.</h1></center>'
				);
		//
		const dataObj = await getGoogleAccountFromCode(query.code);
		if (!dataObj)
			return res
				.status(401)
				.send(
					'<center><h1 style="color: orangered;font-family: monospace;">Google didn\'t authenticate your account with your email address or it was denied by you.<br>Email address must be sent to us to process SignIn/SignUp.</h1></center>'
				);
		// [SocialSignName,sent_mail_DB_sentFor]
		try {
			// Check if already a registered user
			const is_Registered = await credentialsMdl.findOne({
				where: { email: dataObj.email },
			});
			if (!is_Registered) {
				try {
					await socialSignUp(
						dataObj.email,
						dataObj.name,
						{ googleId: dataObj.googleId },
						["Google", "signUpGoogle"]
					);
				} catch (error) {
					storeErr(dataObj, error, req);
					return res
						.status(500)
						.send(
							`<center><h1 style="color: orangered;font-family: monospace;">${error}</h1></center>`
						);
				}
			}
			const user_Info = {
				email: dataObj.email,
				loginCode: 2,
			};
			const loginDataJSON = await processLogin(user_Info);
			res.render("setLocalStoreRedirect", {
				browserStore: { key: "token", value: loginDataJSON },
				redirectURL: "/",
			});
		} catch (error) {
			console.log(error);
			return res.status(401).send(defaultErrMsg);
		}
	} catch (error) {
		console.log(error.message);
		res.send(
			'<center><h1 style="color: orangered;font-family: monospace;">Bad Request detected.<br>Account Verification Failed.</h1></center>'
		);
	}
});
module.exports = router;
