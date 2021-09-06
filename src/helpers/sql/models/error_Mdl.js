const { Model } = require("sequelize");
const {
	model_Init_Options_Cmn,
	int_11_NOT_NULL,
	TEXT_NULL_DEFAULT_NULL,
} = require("./mdl_obj_fascilator");
class error_Mdl extends Model {}
error_Mdl.init(
	{
		slno: {
			...int_11_NOT_NULL,
			primaryKey: true, // set as primary key
			autoIncrement: true, // set auto-increment
		},
		userInfo: { ...TEXT_NULL_DEFAULT_NULL },
		error: { ...TEXT_NULL_DEFAULT_NULL },
	},
	{
		...model_Init_Options_Cmn,
		modelName: "stored_errors",
		timestamps: true,
		// If don't want createdAt
		createdAt: true,
	}
);
module.exports = error_Mdl;
