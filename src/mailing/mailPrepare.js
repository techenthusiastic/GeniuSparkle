const { storeErr, defaultErrMsg } = require("./../helpers/utllity/storeErr");
const { mailSender } = require("./mailSender");
const fs = require("fs").promises;
const mailData = {
	senderName: "GeniuSparkle",
	senderEmail: "noreply.shredtest@gmail.com",
	sendTo: "",
	mailSub: "",
	htmlBody: "",
	textBody: "",
};
const { v4: uuidv4 } = require("uuid");
function mailPrepare(sendTo, templateCode, replaceDataArr = false) {
	return new Promise(async (resolve, reject) => {
		try {
			if (templateCode >= 1 && templateCode <= 2) {
				// Initiate Register - Join Now Verification Mail
				let htmlBody;
				try {
					htmlBody = await fs.readFile(
						`./src/mailing/htmlMailSource/${
							templateCode === 1 ? "initRegister.txt" : "forgotPswd.txt"
						}`,
						"utf8"
					);
				} catch (error) {
					storeErr({ sendTo, templateCode }, error);
					throw new Error();
				}
				const mailUID = uuidv4();
				const verificationLink = `https://geniusparkle.herokuapp.com/emailAuth/${
					templateCode === 1 ? "register" : "resetpswd"
				}/${sendTo}/${mailUID}`;
				htmlBody = htmlBody.replace(
					/\(\(=VerificationLink=\)\)/g,
					verificationLink
				);
				const mailDataN = {
					...mailData,
					sendTo,
					mailSub: `GeniuSparkle : ${
						templateCode === 1
							? "Join Now : Register"
							: "Forgot Password : Create new Password"
					} : Verification Link`,
					htmlBody,
					uuid: mailUID,
				};
				// Valid for 10 mins
				const status = await mailSender(
					mailDataN,
					templateCode === 1 ? "signup" : "resetpswd",
					10
				);
				resolve(status);
			} else if (templateCode === 10) {
				// Social SignIn Data
				let htmlBody;
				try {
					htmlBody = await fs.readFile(
						"./src/mailing/htmlMailSource/socialSign.txt",
						"utf8"
					);
				} catch (error) {
					storeErr({ sendTo, templateCode, replaceDataArr }, error);
					throw new Error();
				}
				htmlBody = htmlBody.replace(
					/\(\(=SocialSignName=\)\)/g,
					replaceDataArr[0]
				);
				htmlBody = htmlBody.replace(
					/\(\(=RandomPassword=\)\)/g,
					replaceDataArr[2]
				);
				const mailDataN = {
					...mailData,
					sendTo,
					mailSub: `GeniuSparkle : SignUp with ${replaceDataArr[0]} Successful : Account Created`,
					htmlBody,
				};
				// Valid for 10 mins
				const status = await mailSender(mailDataN, replaceDataArr[1]);
				resolve(status);
			} else reject();
		} catch (error) {
			if (typeof error === "number") reject(defaultErrMsg);
			else {
				storeErr({ sendTo, templateCode, replaceDataArr }, error);
				reject(error);
			}
		}
	});
}
module.exports = mailPrepare;
