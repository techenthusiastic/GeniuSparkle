const Joi = require("joi");
const emailSch = {
	email: Joi.string()
		.min(3)
		.max(100)
		.lowercase()
		.trim()
		.email({ tlds: { allow: ["com", "in", "edu", "net"] } })
		.required(),
};
const emailV = Joi.object(emailSch);
//
const pswdJoiStr = Joi.string()
	.min(6)
	.max(16)
	.trim()
	.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])(?=.*[\W|_])[a-zA-Z0-9\W]{8,16}$/)
	.required()
	.messages({
		"string.pattern.base": "Password Validation Error : Invalid Format",
	});
module.exports = { emailSch, emailV, pswdJoiStr };
