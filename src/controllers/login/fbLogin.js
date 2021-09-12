const {
	getAccessTokenFromCodeFB,
	getFacebookUserData,
} = require("./../../loginAuths/fbLogin");
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
const socialSignUp = require("./../../app/socialAcntCreate");
const processLogin = require("../../app/processLogin");
const { storeErr, defaultErrMsg } = require("../../helpers/utllity/storeErr");
//
const handleFbOAuthResp = async (req, res) => {
	try {
		const getParams = req.query;
		// console.log(getParams);
		if (getParams.code) {
			const data = await getAccessTokenFromCodeFB(getParams.code);
			// data - false - in case of err / {access_token,expires_in}
			if (data) {
				const fbData = await getFacebookUserData(data.access_token);
				// fbData - false - in case of err / { id, email, first_name, last_name }
				if (fbData) {
					// [SocialSignName,sent_mail_DB_sentFor]
					try {
						// Check if already a registered user
						const is_Registered = await credentialsMdl.findOne({
							where: { email: fbData.email },
						});
						if (!is_Registered) {
							try {
								await socialSignUp(
									fbData.email,
									`${fbData.first_name} ${fbData.last_name}`,
									{ fbId: fbData.id },
									["Facebook", "signUpFB"]
								);
							} catch (error) {
								storeErr(fbData, error, req);
								return res
									.status(500)
									.send(
										`<center><h1 style="color: orangered;font-family: monospace;">${error}</h1></center>`
									);
							}
						}
						const user_Info = {
							email: fbData.email,
							loginCode: 1,
						};
						const loginDataJSON = await processLogin(user_Info);
						res.render("setLocalStoreRedirect", {
							browserStore: { key: "token", value: loginDataJSON },
							redirectURL: "/",
						});
					} catch (error) {
						return res.status(401).send(defaultErrMsg);
					}
				} else {
					storeErr(data, "getFacebookUserData - empty fbData", req);
					return res.status(401).send(defaultErrMsg);
				}
			} else {
				storeErr(getParams, "getAccessTokenFromCodeFB - empty data", req);
				return res.status(401).send(defaultErrMsg);
			}
		} else if (getParams.error) {
			storeErr(
				getParams,
				"Error Received in Facebook Login : Client Side Error",
				req
			);
			return res.status(401).send(defaultErrMsg);
		} else res.send(getParams);
	} catch (error) {
		storeErr({}, error, req);
		return res.status(401).send(defaultErrMsg);
	}
	// {"error":"access_denied","error_code":"200","error_description":"Permissions error","error_reason":"user_denied"}
};
module.exports = handleFbOAuthResp;
