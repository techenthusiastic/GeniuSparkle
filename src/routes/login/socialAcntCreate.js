const mailPrepare = require("./../../mailing/mailPrepare");
//
const { storeErr, defaultErrMsg } = require("./../../helpers/utllity/storeErr");
//
const bcrypt = require("bcrypt");
const saltRounds = 10;
//
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
//
function genRandomPass(email) {
	const signs = "@#%&";
	let pass =
		email.charAt(0).toUpperCase() + Math.random().toString(36).slice(-5);
	const rndmSign = signs.charAt(Math.floor(Math.random() * 4));
	const rndmNum = Math.floor(Math.random() * 9) + 1;
	const randLoc1 = Math.floor(Math.random() * 3) + 1;
	const randLoc2 = Math.floor(Math.random() * 3) + 1;
	pass = pass.slice(0, randLoc1) + rndmSign + pass.slice(randLoc1);
	pass = pass.slice(0, randLoc2) + rndmNum + pass.slice(randLoc2);
	return pass;
}
//
function socialSignUp(email, name, otherData, templateReplaceArr) {
	return new Promise((resolve, reject) => {
		try {
			const randomPass = genRandomPass(email);
			templateReplaceArr.push(randomPass);
			bcrypt.hash(randomPass, saltRounds).then(async (hashedPswd) => {
				if (hashedPswd) {
					const accData = {
						email,
						name,
						password: hashedPswd,
						status: 1,
						otherData,
					};
					const created_User = await credentialsMdl.create(accData);
					if (created_User) {
						try {
							const status = await mailPrepare(email, 10, templateReplaceArr);
							if (status.sendSuccess) resolve();
							else reject();
						} catch (err) {
							reject(err ? err : defaultErrMsg);
						}
					} else {
						storeErr(
							{ email, otherData },
							"User Creation Failed at socialSignUp - socialAcntCreate"
						);
						reject();
					}
				} else {
					storeErr(
						{ email, otherData },
						"Error: Hash Password generate Failed."
					);
					reject();
				}
			});
		} catch (error) {
			storeErr({ email, otherData }, error);
			reject();
		}
	});
}
module.exports = socialSignUp;
