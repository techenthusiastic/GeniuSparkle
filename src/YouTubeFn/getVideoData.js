const { youTubeService, setAuthCredentials } = require("./../googleAuth/index");
//
async function getVideoData(reqBody) {
	const tokenJSON = JSON.parse(reqBody.token);
	const oauth2Client = await setAuthCredentials(tokenJSON);
	const response = await youTubeService.videos.list({
		auth: oauth2Client,
		part: "contentDetails,fileDetails,id,liveStreamingDetails,localizations,player,processingDetails,recordingDetails,snippet,statistics,status,suggestions,topicDetails",
		id: vid_Id,
	});
	console.log(response.data.items[0].player.embedHtml);
	return true;
}
