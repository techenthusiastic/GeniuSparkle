const jwt = require("jsonwebtoken");
//
const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "";
// Generates JWT Access Token with payload object
function genAccessToken(objData) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			objData,
			JWT_ACCESS_SECRET,
			{
				// expiresIn: "15s",
			},
			(err, access_Token) => {
				if (err || !access_Token) reject(err);
				else resolve(access_Token);
			}
		);
	});
}
function genRefreshToken(objData) {
	return new Promise((resolve, reject) => {
		jwt.sign(
			objData,
			JWT_REFRESH_SECRET,
			{
				// expiresIn: "15s",
			},
			(err, refresh_Token) => {
				if (err || !refresh_Token) reject(err);
				else resolve(refresh_Token);
			}
		);
	});
}
module.exports = { genAccessToken, genRefreshToken };
