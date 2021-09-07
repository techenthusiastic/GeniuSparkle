const router = require("express").Router();
const { getIP } = require("./../../helpers/utllity/storeErr");
const axios = require("axios");
//
router.get("/server1", async (req, res) => {
	try {
		const userIP = await getIP(req);
		const { data } = await axios({
			url: `http://www.geoplugin.net/json.gp?ip=${userIP}`,
			method: "post",
		});
		const countryName = data.geoplugin_countryName;
		const countryCode = geoplugin_countryCode;
		if (countryName && countryCode) res.send({ countryName, countryCode });
		else res.send("NOT_FOUND");
	} catch (error) {
		res.send("ERROR");
	}
});
router.get("/2", async (req, res) => {
	try {
		const userIP = await getIP(req);
		console.log(userIP);
		const { data } = await axios({
			url: `https://ip2c.org/?ip=${userIP}`,
			method: "post",
		});
		console.log(data);
		res.send(data);
	} catch (error) {
		res.send(error.stack);
	}
});
module.exports = router;
