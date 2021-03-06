var fs = require("fs");
var readline = require("readline");
var { google } = require("googleapis");
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR =
	(process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) +
	"/.credentials/";
var TOKEN_PATH = TOKEN_DIR + "youtube-nodejs-quickstart.json";

// Load client secrets from a local file.
fs.readFile("client_secret.json", function processClientSecrets(err, content) {
	if (err) {
		console.log("Error loading client secret file: " + err);
		return;
	}
	// Authorize a client with the loaded credentials, then call the YouTube API.
	authorize(JSON.parse(content), getChannel);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
	var clientSecret = credentials.web.client_secret;
	var clientId = credentials.web.client_id;
	var redirectUrl = credentials.web.redirect_uris[0];
	var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

	// Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function (err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
	var authUrl = oauth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
	console.log("Authorize this app by visiting this url: ", authUrl);
	var rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("Enter the code from that page here: ", function (code) {
		rl.close();
		oauth2Client.getToken(code, function (err, token) {
			if (err) {
				console.log("Error while trying to retrieve access token", err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != "EEXIST") {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
		if (err) throw err;
		console.log("Token stored to " + TOKEN_PATH);
	});
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const service = google.youtube("v3");
//
async function getChannel(auth) {
	// console.log(service.channels);
	const response = await service.channels.list({
		auth: auth,
		part: "id,snippet,statistics",
		mine: true,
	});
	const items = response.data.items[0];
	const ret_Obj = {
		channel_Id: items.id,
		channel_Title: items.snippet.title,
		channel_Views: items.statistics.viewCount,
	};
	// console.log(ret_Obj);
	getPlaylist(auth);
	return ret_Obj;
}

async function getPlaylist(auth) {
	const res = await service.playlists.list({
		auth: auth,
		part: "contentDetails,id,snippet,localizations,player,status",
		mine: true,
	});
	const resData = res.data;
	const ret_Obj = {
		total_Channels: resData.pageInfo.totalResults,
		channels_Details: resData.items,
	};
	// console.log(JSON.stringify(ret_Obj));
	getPlaylistItems(auth, ret_Obj.channels_Details[0].id);
	getPlaylistItems(auth, ret_Obj.channels_Details[1].id);
	return ret_Obj;
}
async function getPlaylistItems(auth, playlistId) {
	const res = await service.playlistItems.list({
		auth,
		part: "contentDetails,id,snippet,status",
		playlistId,
	});
	const resDataItems = res.data.items;
	if (resDataItems.length === 0) return "No Video in this Playlist";
	else {
		resDataItems.forEach((each) => {
			getVideoData(auth, each.contentDetails.videoId);
		});
	}
	return true;
}
async function getVideoData(auth, vid_Id) {
	const res = await service.videos.list({
		auth,
		part: "contentDetails,fileDetails,id,liveStreamingDetails,localizations,player,processingDetails,recordingDetails,snippet,statistics,status,suggestions,topicDetails",
		id: vid_Id,
	});
	console.log(res.data.items[0].player.embedHtml);
	return true;
}
