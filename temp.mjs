import crypto from "crypto";
import OAuth from "oauth-1.0a";
import fetch from "node-fetch";
// console.log(twitterConfig);
function prepareAuthorizationHeader(request) {
	return new Promise((resolve, reject) => {
		try {
			const oauth = OAuth({
				consumer: {
					key: "dPdq0ww8SHvi5pIIMfqnTkcaG",
					secret: "APSkDtTUml1ZWjWWE0aKQSl55M2idx5q6V7yDibHN9FYfA61Hz",
				},
				signature_method: "HMAC-SHA1",
				hash_function(base_string, key) {
					return crypto
						.createHmac("sha1", key)
						.update(base_string)
						.digest("base64");
				},
			});
			const authorization = oauth.authorize(request, {
				key: "862524028241584128-JY6akkGGE8180d1TmLvqe3CeweyFKBi",
				secret: "4B3uY4EA8kf8wARvsLSTj5xUInh9MGe6uwhg6NvNd4aGu",
			});
			const header = oauth.toHeader(authorization);
			resolve(header);
		} catch (error) {
			console.log(error);
			reject(false);
		}
	});
}

(async () => {
	try {
		//
		// const noonce = crypto.randomBytes(16).toString("base64");
		// console.log(noonce);
		// return false;
		//
		const request_data = {
			url: "https://api.twitter.com/oauth/request_token",
			method: "POST",
		};
		const authHeader = await prepareAuthorizationHeader(request_data);
		console.log(authHeader.Authorization);
		//
		const promise = await fetch(request_data.url, {
			method: "post",
			headers: {
				Authorization: authHeader.Authorization,
			},
			body: request_data.data,
		});
		const resp = await promise.text();
		console.log(resp);
	} catch (error) {
		console.log(error.stack);
	}
})();
