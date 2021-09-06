const { google } = require("googleapis");
const googleConfig = {
	clientId: process.env.gClientId,
	clientSecret: process.env.gClientSecret,
	redirect: process.env.gRedirect,
};
//
const oAuth2Client = new google.auth.OAuth2(
	googleConfig.clientId,
	googleConfig.clientSecret,
	googleConfig.redirect
);
google.options({ auth: oAuth2Client });
// Get SignIn with Google Connection URL
// This scope tells google what information we want to request.
// const defaultScope = [
// 	"https://www.googleapis.com/auth/userinfo.email",
// 	"https://www.googleapis.com/auth/userinfo.profile",
// ];
// // Get a url which will open the google sign-in page and request access to the scope provided
// function getConnectionUrl(auth) {
// 	return auth.generateAuthUrl({
// 		access_type: "offline",
// 		scope: defaultScope,
// 	});
// }
// console.log(getConnectionUrl(oAuth2Client));
// const SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
// // Get a url which will open the google sign-in page and request access to the scope provided
// function getConnectionUrl(auth) {
// 	return auth.generateAuthUrl({
// 		access_type: "offline",
// 		scope: SCOPES,
// 	});
// }
// console.log(getConnectionUrl(oAuth2Client));
// For Gmail API
// const SCOPES = ["https://mail.google.com/"];
// // Get a url which will open the google sign-in page and request access to the scope provided
// function getConnectionUrl(auth) {
// 	return auth.generateAuthUrl({
// 		access_type: "offline",
// 		scope: SCOPES,
// 	});
// }
// console.log(getConnectionUrl(oAuth2Client));
async function getTokenFromCode(code) {
	// get the auth "tokens" from the request
	const data = await oAuth2Client.getToken(code);
	const tokens = data.tokens;
	return tokens;
}
async function getGoogleAccountFromCode(code) {
	const tokens = await getTokenFromCode(code);
	setAuthCredentials(tokens);
	//
	const { data } = await people.people.get({
		resourceName: "people/me",
		personFields: "emailAddresses,names",
	});
	if (
		!(
			data.emailAddresses &&
			data.emailAddresses[0] &&
			data.emailAddresses[0].value
		)
	)
		return false;
	//
	obj = {
		googleId: data.resourceName.split("/")[1],
		email: data.emailAddresses[0].value,
		name: data.names[0].displayName,
	};
	return obj;
}
function setAuthCredentials(tokens) {
	oAuth2Client.setCredentials(tokens);
	return oAuth2Client;
}
const people = google.people("v1");
const youTubeService = google.youtube("v3");
module.exports = {
	oAuth2Client, // to be used in email sending API - nodemailer
	getTokenFromCode,
	getGoogleAccountFromCode,
	setAuthCredentials,
	youTubeService,
};
