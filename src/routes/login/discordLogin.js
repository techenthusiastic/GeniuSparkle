const express = require('express');
const fetchP = import('node-fetch').then(mod => mod.default)
const fetch = (...args) => fetchP.then(fn => fn(...args))
const btoa = require('btoa');
const { catchAsync } = require('../../../utils.js');
const { url } = require('inspector');
const { URLSearchParams } = require('url');
const credentialsMdl = require("./../../helpers/sql/models/credentials_Mdl");
const socialSignUp = require("./../../app/socialAcntCreate");
const processLogin = require("../../app/processLogin");
var bcrypt = require("bcryptjs");

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const redirect = encodeURIComponent('http://localhost:3000/api/discord/callback');
const redirect2 = 'http://localhost:3000/api/discord/callback';

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&scope=email&response_type=code&redirect_uri=${redirect}`);
});

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect2);
  const response = await fetch(`https://discordapp.com/api/oauth2/token`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: params
    });

  const json = await response.json();

  var tokenDiscord = "Bearer " + json.access_token;
  const response2 = await fetch(`http://discordapp.com/api/users/@me`,
    {
      method: 'GET',
      headers: {
        Authorization: tokenDiscord,
      },
    });
  const json2 = await response2.json();
  if (json2) {
    try {
      // Check if already a registered user
      const is_Registered = await credentialsMdl.findOne({
        where: { email: json2.email },
      });

      if (!is_Registered) {

        var email = json2.email;
        var name = json2.username;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync("12345678aA@", salt);
        var otherData = { discordId: json2.id };

        const accData = {
          email,
          name,
          password: hash,
          status: 1,
          otherData,
        };
        const created_User = await credentialsMdl.create(accData);
      }
      const user_Info = {
        email: json2.email,
        loginCode: 1,
      };
      const loginDataJSON = await processLogin(user_Info);
      console.log(loginDataJSON)
      res.render("setLocalStoreRedirect", {
        browserStore: { key: "token", value: loginDataJSON },
        redirectURL: "/",
      });
    } catch (error) {
      return res.status(500).json({
        ok: false,
        error: "Something went wrong"
      });
    }
  } else {
    return res.status(400).json({
      ok: false,
      error: "Get user data from discord failed!"
    });
  }
}));

module.exports = router;
