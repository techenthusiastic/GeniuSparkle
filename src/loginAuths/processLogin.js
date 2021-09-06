const { genAccessToken, genRefreshToken } = require("../jwt/jwt_Tokenizer");
function processLogin(user_Info) {
	return new Promise((resolve, reject) => {
		try {
			Promise.all([genAccessToken(user_Info), genRefreshToken(user_Info)])
				.then((values) => {
					const respObj = {
						status: "success",
						accessToken: values[0],
						refreshToken: values[1],
					};
					const respObjJSON = JSON.stringify(respObj);
					resolve(respObjJSON);
				})
				.catch((err) => {
					reject(err);
				});
		} catch (error) {
			reject(error);
		}
	});
}
module.exports = processLogin;
