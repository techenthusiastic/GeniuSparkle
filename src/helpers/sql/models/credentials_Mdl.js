const { Model } = require("sequelize");
const {
	model_Init_Options_Cmn,
	makeUniqueKey,
	int_11_NOT_NULL,
	varchar_100_NOT_NULL_DEFAULT_None,
	varchar_100_NULL_DEFAULT_NULL,
	varchar_255_NOT_NULL_DEFAULT_None,
	varchar_1_NULL_DEFAULT_NULL,
	date_DEFAULT_NULL,
	BOOLEAN_NULL_DEFAULT_0,
	JSON_NULL_DEFAULT_NULL,
} = require("./mdl_obj_fascilator");
class credentialsMdl extends Model {}
//
credentialsMdl.init(
	{
		id: {
			...int_11_NOT_NULL,
			primaryKey: true, // set as primary key
			autoIncrement: true, // set auto-increment
		},
		email: makeUniqueKey({ ...varchar_100_NOT_NULL_DEFAULT_None }),
		password: { ...varchar_255_NOT_NULL_DEFAULT_None },
		name: { ...varchar_100_NULL_DEFAULT_NULL },
		gender: { ...varchar_1_NULL_DEFAULT_NULL },
		dob: { ...date_DEFAULT_NULL },
		isMinor: { ...BOOLEAN_NULL_DEFAULT_0 },
		status: { ...BOOLEAN_NULL_DEFAULT_0 },
		otherData: { ...JSON_NULL_DEFAULT_NULL },
	},
	{
		...model_Init_Options_Cmn,
		modelName: "credentials",
	}
);
module.exports = credentialsMdl;
