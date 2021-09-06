// storeErr(userInfo:object,err:Error)
const error_Mdl = require("./../sql/models/error_Mdl");
function storeErr(userInfo, err, req) {
	try {
		if (req) {
			userInfo.userAgent = req.headers["user-agent"];
			userInfo.ip = req.headers["x-forwarded-for"] || req.ip;
		}
		const obj = {};
		obj.userInfo = JSON.stringify(userInfo);
		// if err is instance off error - stringify , else direct assign if manual error string
		if (err && typeof err === "object") obj.error = err.stack.toString();
		else obj.error = err;
		error_Mdl.create(obj);
	} catch (error) {
		console.log(error);
	}
}
const defaultErrMsg =
	'<center><h1 style="color: orangered;font-family: monospace;">Something went wrong</h1></center>';

module.exports = { storeErr, defaultErrMsg };
