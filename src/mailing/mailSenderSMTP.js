const { storeErr } = require("../helpers/utllity/storeErr");
//
const nodemailer = require("nodemailer");
// UUID for unsubscribe link
const { v4: uuidv4 } = require("uuid");
//
const { emailV } = require("../helpers/joiSchema/frequentUsage");
const sent_mails_Mdl = require("../helpers/sql/models/email_Mdl");
// Setup Authentication
const mailTransporter = nodemailer.createTransport({
	host: "mail.geniusparkle.com",
	port: 465,
	// secure: true, // true for 465, false for other ports
	auth: {
		user: "_mainaccount@geniusparkle.com",
		pass: "79yWPhH6Ts+y4[",
	},
});
(async () => {
	try {
		const mailObject = {
			from: "_mainaccount@geniusparkle.com",
			to: "sinha1abc@gmail.com",
			subject: "hello",
			text: "text",
		};
		const info = await mailTransporter.sendMail(mailObject);
		console.log * info;
	} catch (error) {
		console.log(error);
	}
})();
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
				const info = await mailTransporter.sendMail(mailObject);
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
					`SMTP Error : Mail not Sent : mailTransporter Error: ${
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
				`SMTP Error : Mail Not Sent- ${JSON.stringify(mailObject)}`,
				err
			);
			reject();
		}
	});
}
module.exports = { mailSender };
