const { sequelize } = require("./../connection");
const { DataTypes } = require("sequelize");
// Function to fascilate user_model_object_creation
const mdlObjFasc = (
	type,
	alwNull = false,
	dataLen = false,
	defValue = false
) => {
	const obj = {};
	// Asssign type property
	// First process for all to be used NUMBER data types then STRING -> DATE -> Boolean (TinyINT(1))
	// 1-INTEGER 2-STRING 3-Date 4-Boolean 5-Double
	obj.type =
		type === 1
			? dataLen
				? DataTypes.INTEGER(dataLen)
				: DataTypes.INTEGER
			: type === 2
			? dataLen
				? DataTypes.STRING(dataLen)
				: DataTypes.STRING
			: type == 3
			? DataTypes.DATE
			: type == 4
			? DataTypes.DATEONLY
			: type == 5
			? DataTypes.BOOLEAN
			: type == 6
			? DataTypes.DOUBLE
			: type == 7
			? DataTypes.TEXT
			: type == 8
			? dataLen
				? DataTypes.CHAR(dataLen)
				: DataTypes.CHAR
			: type == 9
			? DataTypes.JSON
			: false;
	// Assign allow_Null property
	obj.allowNull = alwNull ? true : false; // however it follows true to be default
	// Assign default Value
	if (defValue) obj.defaultValue = defValue;
	return obj;
};
const makeUniqueKey = (obj) => {
	// Since object was passed as reference clone into a new object so that default properties remain
	const objClone = { ...obj };
	objClone.unique = true;
	return objClone;
};
const model_Init_Options_Cmn = {
	sequelize,
	// modelName: "", - table-name to be assigned while model init
	charset: "utf8",
	collate: "utf8_general_ci",
	// don't add the timestamp attributes (updatedAt, createdAt)
	timestamps: false,
	// If don't want createdAt
	createdAt: false,
	// If don't want updatedAt
	updatedAt: false,
	// your other configuration here
};
// Prepare Object for most used model-objects
const frequent_Usage = {
	int_11_DEFAULT_NULL: mdlObjFasc(1, true, false, null),
	int_11_NOT_NULL: mdlObjFasc(1, false),
	varchar_255_DEFAULT_NULL: mdlObjFasc(2, true, false, null),
	varchar_255_NOT_NULL_DEFAULT_None: mdlObjFasc(2, false, false, false),
	varchar_100_NOT_NULL_DEFAULT_None: mdlObjFasc(2, false, 100, false),
	varchar_100_NULL_DEFAULT_NULL: mdlObjFasc(2, true, 100, null),
	varchar_50_NULL_DEFAULT_NULL: mdlObjFasc(2, true, 50, null),
	varchar_20_NULL_DEFAULT_NULL: mdlObjFasc(2, true, 20, null),
	varchar_10_NULL_DEFAULT_NULL: mdlObjFasc(2, true, 10, null),
	varchar_1_NULL_DEFAULT_NULL: mdlObjFasc(2, true, 1, null),
	datetime_DEFAULT_NULL: mdlObjFasc(3, true, false, null),
	date_DEFAULT_NULL: mdlObjFasc(4, true, false, null),
	tinyint_4_DEFAULT_NULL: mdlObjFasc(1, true, 4, null),
	double_DEFAULT_NULL: mdlObjFasc(6, true, false, null),
	BOOLEAN_NULL_DEFAULT_0: mdlObjFasc(5, true, 4, 0),
	TEXT_NULL_DEFAULT_NULL: mdlObjFasc(7, true, false, null),
	JSON_NULL_DEFAULT_NULL: mdlObjFasc(9, true, false, null),
};
module.exports = {
	model_Init_Options_Cmn,
	mdlObjFasc,
	makeUniqueKey,
	...frequent_Usage,
};
