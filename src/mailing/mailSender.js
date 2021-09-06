const storeErr = require("../helpers/utllity/storeErr");
const { emailV } = require("../helpers/joiSchema/frequentUsage");
const sent_mails_Mdl = require("../helpers/sql/models/email_Mdl");
// Setup Authentication
const { oAuth2Client } = require("../loginAuths/googleLogin");
const Google_Config = {
	CLIENT_ID: process.env.gClientId,
	CLIENT_SECRET: process.env.gClientSecret,
};
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
//
const nodemailer = require("nodemailer");
// UUID for unsubscribe link
const { v4: uuidv4 } = require("uuid");
//
async function setupTransporter() {
	oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
	const accessToken = await oAuth2Client.getAccessToken();
	transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: "noreply.shredtest@gmail.com",
			clientId: Google_Config.CLIENT_ID,
			clientSecret: Google_Config.CLIENT_SECRET,
			refreshToken: REFRESH_TOKEN,
			accessToken: accessToken,
		},
	});
	return transporter;
}
//
function mailSender(mailData, sendFor, validFor = false) {
	return new Promise(async (resolve, reject) => {
		let mailObject;
		try {
			try {
				mailData.sendTo = await emailV.validateAsync({
					email: mailData.sendTo,
				});
				mailData.sendTo = mailData.sendTo.email;
			} catch (error) {
				console.log(error);
				storeErr(`Invalid Email ${mailData.sendTo}`, error);
				reject("Invalid Email Detected");
			}
			const transporter = await setupTransporter();
			const mailUID = mailData.uuid ? mailData.uuid : uuidv4();
			const unsubUrl = `http://localhost/email/unsub/${mailData.sendTo}/${mailData.senderEmail}/${mailUID}`;
			// Prepare Mail Body - Append Unsubscribe Link
			let htmlBody = mailData.htmlBody,
				textBody = mailData.textBody;
			if (htmlBody) {
				htmlBody = htmlBody.replace(/\(\(=UnsubLink=\)\)/g, unsubUrl);
				mailData.htmlBody = htmlBody;
			} else if (textBody) {
				textBody = textBody.replace(/\(\(=UnsubLink=\)\)/g, unsubUrl);
				textBody = mailData.textBody;
			}
			//
			mailObject = {
				from: `"${mailData.senderName}" <${mailData.senderEmail}>`,
				to: mailData.sendTo,
				subject: mailData.mailSub,
				html: mailData.htmlBody,
				text: mailData.textBody,
				list: {
					unsubscribe: {
						url: unsubUrl,
						comment: "unsublinking",
					},
				},
			};
			try {
				const info = await transporter.sendMail(mailObject);
				if (info.accepted.length) {
					await sent_mails_Mdl.create({
						email: mailData.sendTo,
						uuid: mailData.uuid,
						sentFor: sendFor,
						sender: mailData.senderEmail,
						validTill: validFor ? Date.now() + validFor * 60 * 1000 : null,
						envelopeTime: info.envelopeTime,
						messageTime: info.messageTime,
						messageSize: info.messageSize,
						messageId: info.messageId,
					});
					return resolve({ sendSuccess: true });
				} else {
					storeErr(
						`GMail API Error: Mail Not Accepted - ${JSON.stringify(mailObject)}`
					);
					return reject(2);
				}
			} catch (err) {
				mailObject.html = mailObject.html.slice(0, 50);
				storeErr(
					`GMail API Error : Mail not Sent : Transporter Error: ${
						err.code
					} - ${JSON.stringify(mailObject)}`,
					err
				);
				// 2 - Server Error/No Internet Server, 3 - Invalid Recepient, 4 - Auth Failed
				if (err.code === "EENVELOPE") reject(3);
				else if (err.code === "EAUTH") reject(4);
				else reject(2);
			}
		} catch (err) {
			console.log(err);
			if (mailObject) mailObject.html = mailObject.html.slice(0, 50);
			storeErr(
				`GMail API Error: Mail Not Sent- ${JSON.stringify(mailObject)}`,
				err
			);
			reject();
		}
	});
}
module.exports = { mailSender };
