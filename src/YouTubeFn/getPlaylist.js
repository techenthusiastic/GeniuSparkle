const { youTubeService, setAuthCredentials } = require("./../googleAuth/index");
async function getPlaylist(reqBody) {
	const tokenJSON = JSON.parse(reqBody.token);
	const oauth2Client = await setAuthCredentials(tokenJSON);
	const response = await youTubeService.playlists.list({
		auth: oauth2Client,
		part: "contentDetails,id,snippet,localizations,player,status",
		channelId: reqBody.channelIds,
		maxResults: 50,
	});
	const resData = response.data;
	const PlayList_ID_Coll = [],
		Playlist_Title_Coll = [];

	const items = resData.items;
	if (items && items.length) {
		items.forEach((each) => {
			PlayList_ID_Coll.push(each.id);
			Playlist_Title_Coll.push(each.snippet.title);
		});
	}
	const ret_Obj = {
		total_Playlist: resData.pageInfo.totalResults,
		playlist_Details: { PlayList_ID_Coll, Playlist_Title_Coll },
	};
	// console.log(ret_Obj);
	return ret_Obj;
}
// getPlaylist({
// 	token: {
// 		access_token:
// 			"ya29.a0ARrdaM84rAHHGX4e2_LuE7cYq0tMyiSwWJb9rxH3N-tC_9WuHyzNCx5exPq1hhUVRej7P6ht7OIg1zocDugXDtut0EcMOQsfsbw4oxIpDEq-SANCDvs0iPHoxxPE0cADgVbbLGL_ZKz8LAZAk3qdEMGWG8_U",
// 		refresh_token:
// 			"1//0g1FiZEHfFLWBCgYIARAAGBASNwF-L9IrAVeLDbsDJ2QslfVnhhkKV34DVFBbmQFNqU8IqXHkh16ZvdXB2erGC2OJHnCPz5BgXMg",
// 		scope: "https://www.googleapis.com/auth/youtube.readonly",
// 		token_type: "Bearer",
// 		expiry_date: 1630599674430,
// 	},
// 	channelIds: "UCxfXzgHzHKiTnN1S2ze87Aw",
// });
module.exports = getPlaylist;
