const createErr = require("http-errors");
//
const {
	storeErr,
	defaultErrMsg,
	defaultErrMsgTxt,
} = require("./../../helpers/utllity/storeErr");
//
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
const socialSignUp = require("./../../app/socialAcntCreate");
const processLogin = require("../../app/processLogin");
//
const {
	prepareAuthorizationHeader,
	getUserData,
} = require("./../../loginAuths/twitter");
//
const axios = require("axios");
// To parse query param
const url = require("url");
//
const handleRequestToken = async (req, res, next) => {
	try {
		const request_data = {
			url: "https://api.twitter.com/oauth/request_token",
			method: "POST",
		};
		const authHeader = await prepareAuthorizationHeader(request_data, {});
		//
		const { data } = await axios({
			url: request_data.url,
			method: request_data.method,
			headers: authHeader,
		});
		const respParams = url.parse(`?${data}`, true).query;
		if (respParams.oauth_callback_confirmed === "true") {
			// Sign Up
			res.redirect(
				303,
				`https://api.twitter.com/oauth/authorize?oauth_token=${respParams.oauth_token}`
			);
			// Login
			// res.redirect(
			// 	303,
			// 	`https://api.twitter.com/oauth/authenticate?oauth_token=${respParams.oauth_token}`
			// );
		} else {
			storeErr("", `Twitter Login Failed ${respParams}`, req);
			return next(createErr.InternalServerError(defaultErrMsgTxt));
		}
	} catch (error) {
		storeErr("", error, req);
		return next(createErr.InternalServerError(defaultErrMsgTxt));
	}
};
// .
const handleAuthenticate = async (req, res) => {
	try {
		const queryParam = req.query;
		const request_data = {
			url: `https://api.twitter.com/oauth/access_token?oauth_token=${queryParam.oauth_token}&oauth_verifier=${queryParam.oauth_verifier}`,
			method: "POST",
		};
		const authHeader = await prepareAuthorizationHeader(request_data);
		//
		const { data } = await axios({
			url: request_data.url,
			method: request_data.method,
			headers: authHeader,
		});
		const respParams = url.parse(`?${data}`, true).query;
		const userInfo = await getUserData(respParams);
		console.log(userInfo);
		// Check if already a registered user
		const is_Registered = await credentialsMdl.findOne({
			where: { email: userInfo.email },
		});
		if (!is_Registered) {
			try {
				await socialSignUp(
					userInfo.email,
					userInfo.name,
					{
						id: userInfo.id,
						id_str: userInfo.id_str,
						screen_name: userInfo.screen_name,
						created_at: userInfo.created_at,
					},
					["Twitter", "signUpTwitter"]
				);
			} catch (error) {
				storeErr(userInfo, error, req);
				return res
					.status(500)
					.send(
						`<center><h1 style="color: orangered;font-family: monospace;">${error}</h1></center>`
					);
			}
		}
		const user_Info = {
			email: userInfo.email,
			loginCode: 2,
		};
		const loginDataJSON = await processLogin(user_Info);
		res.render("setLocalStoreRedirect", {
			browserStore: { key: "token", value: loginDataJSON },
			redirectURL: "/",
		});
	} catch (error) {
		storeErr("", error, req);
		return res.status(401).send(defaultErrMsg);
	}
};
//
module.exports = { handleRequestToken, handleAuthenticate };
