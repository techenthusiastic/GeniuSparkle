// const queryString = require("query-string");
const FB_App_ID = process.env.FB_App_ID;
const FB_App_Secret = process.env.FB_App_Secret;
// const stringifiedParams = queryString.stringify({
// 	client_id: FB_App_ID,
// 	// redirect_uri: "http://localhost/facebook/authenticate/",
// 	redirect_uri: "https://geniusparkle.herokuapp.com/facebook/authenticate",
// 	scope: ["email", "public_profile"].join(","), // comma seperated string
// 	response_type: "code",
// 	auth_type: "rerequest",
// 	display: "popup",
// 	// state:[{st:'state123abc'}]{"{st=state123abc,ds=123456789}"},
// });
// const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
// console.log(facebookLoginUrl);
//
const axios = require("axios");
async function getAccessTokenFromCodeFB(code) {
	try {
		const { data } = await axios({
			url: "https://graph.facebook.com/v11.0/oauth/access_token",
			method: "get",
			params: {
				client_id: FB_App_ID,
				client_secret: FB_App_Secret,
				// redirect_uri: "http://localhost/facebook/authenticate/",
				redirect_uri:
					"https://geniusparkle.herokuapp.com/facebook/authenticate",
				code,
			},
		});
		// console.log(data);
		const retObj = {
			access_token: data.access_token,
			expires_in: data.expires_in,
		};
		return retObj;
	} catch (error) {
		console.log(error.message);
		return false;
	}
}
async function getFacebookUserData(access_token) {
	try {
		const { data } = await axios({
			url: "https://graph.facebook.com/me",
			method: "get",
			params: {
				fields: ["id", "email", "first_name", "last_name"].join(","),
				access_token,
			},
		});
		// { id, email, first_name, last_name }
		return data;
	} catch (error) {
		console.log(error.message);
		return false;
	}
}
module.exports = { getAccessTokenFromCodeFB, getFacebookUserData };
