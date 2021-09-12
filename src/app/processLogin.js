const { genAccessToken, genRefreshToken } = require("../jwt/jwt_Tokenizer");
function processLogin(user_Info, typeJSON = true) {
	return new Promise((resolve, reject) => {
		try {
			Promise.all([genAccessToken(user_Info), genRefreshToken(user_Info)])
				.then((values) => {
					const respObj = {
						accessToken: values[0],
						refreshToken: values[1],
					};
					if (typeJSON) {
						const respObjJSON = JSON.stringify(respObj);
						resolve(respObjJSON);
					} else resolve(respObj);
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
