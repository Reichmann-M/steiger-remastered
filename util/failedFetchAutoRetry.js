const ytdl = require("ytdl-core");
const ytdl_discord = require("ytdl-core-discord");
const youtube = require("scrape-youtube").default;
const ytMusic = require("../include/YoutubeMusicApi/index.js");
const ytsr = require("../node_modules/youtube-sr/index");
const vid_data = require("vid_data");
const failedFetchAutoRetry = (module.exports = async (fetchType, fetchItem) => {
  async function getFetchedResult(fetchType) {
    switch (fetchType) {
      case "ytdl":
        itemInfo = await ytdl_discord(fetchItem, {
          filter: "audioonly",
          opusEncoded: true,
          // encoderArgs: ['-af', 'bass=g=10,dynaudnorm=f=200']
        });
        break;
      case "ytdlInfo":
        itemInfo = await ytdl.getBasicInfo(fetchItem);
        break;
      case "youtube.search-video":
        itemInfo = await youtube.search(fetchItem, {
          type: "video",
        });
        break;
      case "music":
        itemInfo = await ytMusic["default"].search(fetchItem);
        break;
      case "ytsr.getPlaylist":
        itemInfo = await ytsr.getPlaylist(fetchItem);
        break;
      case "vid_data.get_channel_id":
        itemInfo = await vid_data.get_channel_id(fetchItem);
        break;
      default:
        itemInfo = null;
        break;
    }
    return itemInfo;
  }

  var itemInfo = null;
  try {
    itemInfo = await getFetchedResult(fetchType);
  } catch (error) {
    // console.log(error); // remove for production
    itemInfo = null;
  }

  if (itemInfo == null) {
    for (let i = 0; i < 2; i++) {
      // sleep 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        itemInfo = await getFetchedResult(fetchType);
        break;
      } catch (error) {
        // console.log(error); // remove for production
        itemInfo = null;
      }
    }
  }

  return itemInfo;
});