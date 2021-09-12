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
const pswdJoiStr = Joi.string().min(8).max(30).trim().required().messages({
	"string.pattern.base": "Password Validation Error : Invalid Format",
});
module.exports = { emailSch, emailV, pswdJoiStr };
