const crypto = require("crypto");
const OAuth = require("oauth-1.0a");
//
const twitterConfig = {
	oAuth_CONSUMER_KEY: process.env.Twitter_API_Key,
	oAuth_CONSUMER_SECRET: process.env.Twitter_API_Key_Secret,
};
//
const prepareAuthorizationHeader = (request, oAuth_KeySecret) => {
	return new Promise((resolve, reject) => {
		try {
			const oauth = OAuth({
				consumer: {
					key: twitterConfig.oAuth_CONSUMER_KEY,
					secret: twitterConfig.oAuth_CONSUMER_SECRET,
				},
				signature_method: "HMAC-SHA1",
				hash_function(base_string, key) {
					return crypto
						.createHmac("sha1", key)
						.update(base_string)
						.digest("base64");
				},
			});
			const authorization = oauth.authorize(request, oAuth_KeySecret);
			const header = oauth.toHeader(authorization);
			resolve(header);
		} catch (error) {
			reject(false);
		}
	});
};
//
const getUserData = async (respParams) => {
	const request_data = {
		url: `https://api.twitter.com/1.1/account/verify_credentials.json?screen_name=${respParams.screen_name}&include_email=true&include_entities=false&skip_status=true`,
		method: "GET",
	};
	const authHeader = await prepareAuthorizationHeader(request_data, {
		key: respParams.oauth_token,
		secret: respParams.oauth_token_secret,
	});
	//
	const { data } = await axios({
		url: request_data.url,
		method: request_data.method,
		headers: authHeader,
	});
	return data;
};
//
module.exports = { prepareAuthorizationHeader, getUserData };
