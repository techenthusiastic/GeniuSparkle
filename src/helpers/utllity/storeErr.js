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
function createHTMLErr(midHTMLMsg) {
	return `<center><h1 style="color: orangered;font-family: monospace;">${midHTMLMsg}</h1></center>`;
}
const defaultErrMsg = createHTMLErr(
	"Something went wrong.<br>Your request couldn't be fulfilled at the moment.<br>Please try again after sometime."
);
const defaultErrMsgTxt =
	"Something went wrong.Your request couldn't be fulfilled at the moment.Please try again after sometime.";
module.exports = {
	storeErr,
	createHTMLErr,
	defaultErrMsg,
	defaultErrMsgTxt,
	getIP,
};
