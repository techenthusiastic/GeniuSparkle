const { Model } = require("sequelize");
const {
	model_Init_Options_Cmn,
	makeUniqueKey,
	int_11_NOT_NULL,
	varchar_255_DEFAULT_NULL,
	varchar_50_NULL_DEFAULT_NULL,
	varchar_100_NOT_NULL_DEFAULT_None,
	BOOLEAN_NULL_DEFAULT_0,
	varchar_20_NULL_DEFAULT_NULL,
	varchar_10_NULL_DEFAULT_NULL,
} = require("./mdl_obj_fascilator");
class sent_mails_Mdl extends Model {}
//
sent_mails_Mdl.init(
	{
		slno: {
			...int_11_NOT_NULL,
			primaryKey: true, // set as primary key
			autoIncrement: true, // set auto-increment
		},
		email: { ...varchar_100_NOT_NULL_DEFAULT_None },
		uuid: makeUniqueKey({ ...varchar_255_DEFAULT_NULL }),
		sentFor: { ...varchar_50_NULL_DEFAULT_NULL },
		sender: { ...varchar_100_NOT_NULL_DEFAULT_None },
		action_used: { ...BOOLEAN_NULL_DEFAULT_0 },
		validTill: { ...varchar_20_NULL_DEFAULT_NULL },
		envelopeTime: { ...varchar_10_NULL_DEFAULT_NULL },
		messageTime: { ...varchar_10_NULL_DEFAULT_NULL },
		messageSize: { ...varchar_10_NULL_DEFAULT_NULL },
		messageId: { ...varchar_50_NULL_DEFAULT_NULL },
	},
	{ ...model_Init_Options_Cmn, modelName: "sent_mails" }
);
module.exports = sent_mails_Mdl;
