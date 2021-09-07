const router = require("express").Router();
router.get("/authenticate", (req, res) => {
	console.log(req.params);
	res.send("Received");
});
const axios = require("axios");
(async () => {
	try {
		const { data } = await axios({
			url: "https://api.twitter.com/oauth/request_token",
			method: "post",
			Headers: {
				Authorization: `OAuth oauth_nonce="K7ny27JTpKVsTgdyLdDfmQQWVLERj2zAK5BslRsqyw", oauth_callback="http://localhost/twitter/authenticate", oauth_signature_method="HMAC-SHA1", oauth_timestamp="${Date.now()}", oauth_consumer_key="dPdq0ww8SHvi5pIIMfqnTkcaG", oauth_signature="Pc%2BMLdv028fxCErFyi8KXFM%2BddU%3D", oauth_version="1.0"`,
			},
			data: {
				oauth_callback: "http://localhost/twitter/authenticate",
				x_auth_access_type: "read",
			},
		});
		console.log(data);
	} catch (error) {
		console.log(error.stack);
	}
})();
module.exports = router;
