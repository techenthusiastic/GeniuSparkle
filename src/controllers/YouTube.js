const createErr = require("http-errors");
const {
	storeErr,
	createHTMLErr,
	defaultErrMsg,
} = require("./../helpers/utllity/storeErr");
const { getTokenFromCode } = require("./../loginAuths/googleLogin");
//
const getChannel = require("./../app/YouTube/getChannel");
const getPlaylist = require("./../app/YouTube/getPlaylist");
const getPlaylistItems = require("./../app/YouTube/getPlaylistItems");
//
const loginHandler = async (req, res) => {
	try {
		const query = req.query;
		if (query.error) {
			const sendErrHTML = createHTMLErr(
				`Something went wrong.<br>Google says : ${query.error}`
			);
			return res.send(sendErrHTML);
		} else if (!query.code) {
			const sendErrHTML = createHTMLErr(
				"Something went wrong.<br>Invalid Response was sent by Google."
			);
			return res.send(sendErrHTML);
		}
		const tokenJSON = await getTokenFromCode(query.code);
		const tokenStr = JSON.stringify(tokenJSON);
		console.log(tokenStr);
		// window.location.assign('/');window.location.assign('/');
		res.send(
			`<p>Please wait while you are redirected.</p> <script>window.localStorage.setItem("token",'${tokenStr}');</script>`
		);
	} catch (error) {
		console.log(error.message);
		res.send(
			'<center><h1 style="color: orangered;font-family: monospace;">Bad Request detected.<br>Account Verification Failed.</h1></center>'
		);
	}
};
//
const getChannelHandler = async (req, res, next) => {
	try {
		const data = await getChannel(req.body);
		res.send(data);
	} catch (error) {
		console.log(error);
		next(createErr.InternalServerError("Something went wrong"));
	}
};
//
const getPlaylistHandler = async (req, res, next) => {
	try {
		const data = await getPlaylist(req.body);
		res.send(data);
	} catch (error) {
		console.log(error.message);
		next(createErr.InternalServerError("Something went wrong"));
	}
};
//
const getPlaylistItemsHandler = async (req, res, next) => {
	try {
		const data = await getPlaylistItems(req.body);
		res.send(data);
	} catch (error) {
		console.log(error.message);
		next(createErr.InternalServerError("Something went wrong"));
	}
};
//
const getAllVideosHandler = async (req, res, next) => {
	try {
		const reqBody = req.body;
		const { channel_Id_Coll } = await getChannel(reqBody);
		if (channel_Id_Coll && channel_Id_Coll.length) {
			const promiseColl = [];
			channel_Id_Coll.forEach((each) => {
				const promise = getPlaylistItems({
					token: reqBody.token,
					playListId: each,
				});
				promiseColl.push(promise);
			});
			Promise.all(promiseColl)
				.then((values) => {
					let ttlVid = 0,
						titleColl = [],
						Vid_Id_Coll = [];
					values.forEach((each) => {
						ttlVid += each.total_Video;
						titleColl = [
							...titleColl,
							...each.playlistItem_Details.PlaylistItems_Title_Coll,
						];
						Vid_Id_Coll = [
							...Vid_Id_Coll,
							...each.playlistItem_Details.PlayListVideoId_Coll,
						];
					});
					res.send({
						total_Video: ttlVid,
						playlistItem_Details: {
							PlaylistItems_Title_Coll: titleColl,
							PlayListVideoId_Coll: Vid_Id_Coll,
						},
					});
				})
				.catch((err) => {
					console.log(err);
					next(createErr.InternalServerError("Something went wrong."));
				});
		} else res.send({ channel_Id_Coll });
	} catch (error) {
		console.log(error.message);
		next(createErr.InternalServerError("Something went wrong"));
	}
};
//
module.exports = {
	loginHandler,
	getChannelHandler,
	getPlaylistHandler,
	getPlaylistItemsHandler,
	getAllVideosHandler,
};
