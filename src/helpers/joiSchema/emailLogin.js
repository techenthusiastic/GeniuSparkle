const Joi = require("joi");
const { emailSch, pswdJoiStr } = require("./frequentUsage");

const pswdSch = {
	password: pswdJoiStr,
};
const signInV = Joi.object({
	...emailSch,
	...pswdSch,
});
const initRegisterV = Joi.object({
	name: Joi.string().max(60).trim().required(),
	...emailSch,
	...pswdSch,
	gender: Joi.string().min(1).max(1).trim().required(),
	dob: Joi.date().required(),
	isMinor: Joi.boolean().required(),
});
const verifyLinkMailV = Joi.object({
	...emailSch,
	action: Joi.string().min(3).max(10).trim().required(),
	mailUID: Joi.string().min(20).max(50).trim().required(),
});
const resetPswdV = Joi.object({
	...emailSch,
	mailUID: Joi.string().min(20).max(50).trim().required(),
	...pswdSch,
});
module.exports = { signInV, initRegisterV, verifyLinkMailV, resetPswdV };
