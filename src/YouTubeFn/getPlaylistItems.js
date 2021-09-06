const { youTubeService, setAuthCredentials } = require("./../googleAuth/index");
//
async function getPlaylistItems(reqBody) {
	// const tokenJSON = reqBody.token;
	const tokenJSON = JSON.parse(reqBody.token);
	const oauth2Client = await setAuthCredentials(tokenJSON);
	const response = await youTubeService.playlistItems.list({
		auth: oauth2Client,
		part: "contentDetails,id,snippet",
		playlistId: reqBody.playListId,
	});
	const resDataItems = response.data.items;
	const PlaylistItems_Title_Coll = [],
		PlayListVideoId_Coll = [];
	if (resDataItems && resDataItems.length) {
		resDataItems.forEach((each) => {
			PlaylistItems_Title_Coll.push(each.snippet.title);
			PlayListVideoId_Coll.push(each.contentDetails.videoId);
		});
	}
	const ret_Obj = {
		total_Video: response.data.pageInfo.totalResults,
		playlistItem_Details: {
			PlaylistItems_Title_Coll,
			PlayListVideoId_Coll,
		},
	};
	// console.log(ret_Obj);
	return ret_Obj;
}
// Tester
// getPlaylistItems({
// 	token: {
// 		access_token:
// 			"ya29.a0ARrdaM91mNDDYQR0F_gPBQzBx5_ITaxMvRHSe3Pi68U8du3GVLDPiDygVZm-LTUwksjoZzjvt8teEeeG0Zo_ABz5ROYsuEADt39Elj3IpIYTz22UwB4vABVY6U5UfxrNJxA3uBgBSVapWa85-r71nQUS-xpE",
// 		refresh_token:
// 			"1//0glgvJdzvx2IqCgYIARAAGBASNwF-L9Irmeovi3sKSIGqW-g7s4BITMVjITPz2gjr5r544ttSTnbjsGo2gPK9RmKFW1Hgq-48ckI",
// 		scope: "https://www.googleapis.com/auth/youtube.readonly",
// 		token_type: "Bearer",
// 		expiry_date: 1630614851323,
// 	},
// 	playListId: "PL92sLJmzXG3wLo4JUgUKCGPc3lmfo1wrr",
// });
module.exports = getPlaylistItems;
