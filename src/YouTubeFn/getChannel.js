const { youTubeService, setAuthCredentials } = require("./../googleAuth/index");
async function getChannel(reqBody) {
	// const tokenJSON = token;
	const tokenJSON = JSON.parse(reqBody.token);
	const oauth2Client = await setAuthCredentials(tokenJSON);
	const response = await youTubeService.channels.list({
		auth: oauth2Client,
		part: "contentDetails,id,snippet,statistics",
		mine: true,
	});
	const items = response.data.items;
	const channel_Id_Coll = [],
		channel_Title_Coll = [],
		channel_Views_Coll = [];
	// console.log(JSON.stringify(items));
	if (items && items.length) {
		// When all the Video Uploaded is Requested
		if (reqBody.aUploads) {
			items.forEach((each) => {
				channel_Id_Coll.push(each.contentDetails.relatedPlaylists.uploads);
			});
		} else
			items.forEach((each) => {
				channel_Id_Coll.push(each.id);
				channel_Title_Coll.push(each.snippet.title);
				channel_Views_Coll.push(each.statistics.viewCount);
			});
	}
	const ret_Obj = {
		channel_Id_Coll,
		channel_Title_Coll,
		channel_Views_Coll,
	};
	return ret_Obj;
}
// getChannel({
// 	access_token:
// 		"ya29.a0ARrdaM84rAHHGX4e2_LuE7cYq0tMyiSwWJb9rxH3N-tC_9WuHyzNCx5exPq1hhUVRej7P6ht7OIg1zocDugXDtut0EcMOQsfsbw4oxIpDEq-SANCDvs0iPHoxxPE0cADgVbbLGL_ZKz8LAZAk3qdEMGWG8_U",
// 	refresh_token:
// 		"1//0g1FiZEHfFLWBCgYIARAAGBASNwF-L9IrAVeLDbsDJ2QslfVnhhkKV34DVFBbmQFNqU8IqXHkh16ZvdXB2erGC2OJHnCPz5BgXMg",
// 	scope: "https://www.googleapis.com/auth/youtube.readonly",
// 	token_type: "Bearer",
// 	expiry_date: 1630599674430,
// });
module.exports = getChannel;
