// storeErr(userInfo:object,err:Error)
const error_Mdl = require("./../sql/models/error_Mdl");
function getIP(req) {
	return new Promise((resolve) => {
		const ipAddress =
			(typeof req.headers["x-forwarded-for"] === "string" &&
				req.headers["x-forwarded-for"].split(",").shift()) ||
			req.connection?.remoteAddress ||
			req.socket?.remoteAddress ||
			req.connection?.socket?.remoteAddress ||
			req.ip;
		resolve(ipAddress);
	});
}
async function storeErr(userInfo, err, req) {
	try {
		if (req) {
			userInfo.userAgent = req.headers["user-agent"];
			userInfo.ip = await getIP(req);
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
const defaultErrMsgTxt = "Something went wrong";
module.exports = { storeErr, defaultErrMsg, defaultErrMsgTxt, getIP };
