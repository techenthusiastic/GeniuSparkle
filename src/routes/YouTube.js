const router = require("express").Router();
//
const controller = require("./../controllers/YouTube");
//
router.get("/login", controller.loginHandler);
//
router.post("/getChannel", controller.getChannelHandler);
//
router.post("/getPlaylist", controller.getPlaylistHandler);
//
router.post("/getPlaylistItems", controller.getPlaylistItemsHandler);
//
router.post("/getAllVideos", controller.getAllVideosHandler);
module.exports = router;
