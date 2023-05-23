// YouTubeLinkHandler

// Video-Link: https://www.youtube.com/watch?v=B9JQRqu0CQM
//             https://www.youtube.com/watch?v=B9JQRqu0CQM&t=35s
//             https://youtu.be/B9JQRqu0CQM?t=35s
//             https://www.youtube.com/watch?v=QYt08ydkaOU
//             https://www.youtube.com/watch?v=8eMFSl8mRlQ
//             https://www.youtube.com/watch?v=-50NdPawLVY

// Stream-Link: https://www.youtube.com/watch?v=5qap5aO4i9A
//              https://youtu.be/5qap5aO4i9A

// Playlist-Link: https://www.youtube.com/playlist?list=PLDisKgcnAC4Tn2kjbXBPiXDu5lVCffkLr

// Channel-Link: https://www.youtube.com/channel/UCm3_j4RLEzgMovQTRPx47MQ
//               https://www.youtube.com/user/DrachenLord1510
//               https://www.youtube.com/c/bibanator
//            -- https://www.youtube.com/bibanator

const {
    MessageEmbed
} = require('discord.js')
// const fs = require('fs')
// const util = require('util')
const MasterHandlerJS = require('./MASTERHANDLER')
const failedFetchAutoRetry = require('../util/failedFetchAutoRetry')
module.exports = {
    async handle(message, youtubeLink = undefined, isPlayNext = false, isShufflePlay = false) {

        // Playlists
        if (youtubeLink.includes('/playlist?list=')) {
            const playlistID = youtubeLink.split('/playlist?list=')[1]
            
            const playlistInfo = await failedFetchAutoRetry('ytsr.getPlaylist', playlistID)
            if (playlistInfo == null || playlistInfo.length == 0) {
                console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play playlist |${youtubeLink}|`)
                message.channel.send(new MessageEmbed({
                    color: "#e60000",
                    description: `❗ Playlist **${youtubeLink}** nicht verfügbar [3 failed attempts to fetch playlist info]`
                }))
                return;
            }

            var queueConstruct = []
            playlistInfo.videos.forEach(video => {
                queueConstruct.push({
                    type: 'YoutubeVideo',
                    playLink: 'https://www.youtube.com/watch?v=' + video.id,
                    title: video.title,
                    duration: video.duration / 1000,
                    thumbnail: message.client.SERVICE_LOGO_LINKS.youtube,
                    author: message.author.id,
                    failedTimes: 0
                })
            });

            await MasterHandlerJS.handlePlaylist(message.guild, queueConstruct, isShufflePlay)
            
            message.reply(new MessageEmbed({
                color: message.client.color,
                description: `[${playlistInfo.title}](${playlistInfo.url}) von [${playlistInfo.channel.name}](${playlistInfo.channel.url}) \n
                **Neu:\n${queueConstruct.length}** Tracks hinzugefügt`,
                image: {url: playlistInfo.thumbnail},
                thumbnail: {url: message.client.SERVICE_LOGO_LINKS.youtube}
            }))

            const PLAYBACK = require('../musicHandler/PLAYBACK')
            return PLAYBACK(message)
        } else {
            if (youtubeLink.includes('/channel/') || youtubeLink.includes('/user/') || youtubeLink.includes('/c/') || (youtubeLink.includes('/watch?v=') == false && youtubeLink.includes('.be/') == false && youtubeLink.includes('/shorts/') == false)) {
                // YouTube Channel

                if (youtubeLink.includes('/channel/') == false) {
                    return message.reply(new MessageEmbed({
                        color: "#e60000",
                        description: `❗ 'Sorry, aber nur YT-Channel-Links mit beinhalteter ID sind zulässig. Z.B.:\n> https://www.youtube.com/channel/UCm3_j4RLEzgMovQTRPx47MQ'`
                    }))
                } 

                var channelID = youtubeLink.split('/channel/')[1]
                // Replace C with U at index 1 in channelID
                channelID = channelID.substring(0, 1) + 'U' + channelID.substring(1 + 1);
                return this.handle(message, `https://www.youtube.com/playlist?list=${channelID}`, isPlayNext, isShufflePlay)

            } else {
                try {
                    // https://youtu.be/dTOhSUwSHEc
                    // https://youtu.be/dTOhSUwSHEc?t=35s
                    // https://www.youtube.com/watch?v=dTOhSUwSHEc
                    // https://www.youtube.com/watch?v=dTOhSUwSHEc?t=35s

                    const itemInfo = await failedFetchAutoRetry('ytdlInfo', youtubeLink)
                    if (itemInfo == null) {
                        console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${youtubeLink}|`)
                        message.channel.send(new MessageEmbed({
                            color: "#e60000",
                            description: `❗ Video **${youtubeLink}** nicht verfügbar [3 failed attempts to fetch video info]`
                        }))
                        return;
                    }

                    // Redirect Videos by Drachenlord to Reuploads of their videos
                    const bannedChannelId = "UCm3_j4RLEzgMovQTRPx47MQ"
                    if (itemInfo.videoDetails.externalChannelId == bannedChannelId) {
                        const YouTubeSearchJS = require('./YouTubeSearch');
                        // return YouTubeSearchJS.handle(message, `${itemInfo.videoDetails.title} reupload`, isPlayNext, isShufflePlay);
                        return YouTubeSearchJS.handle(message, `${itemInfo.videoDetails.title} Drachenlord reupload`, isPlayNext, isShufflePlay);
                    }

                    if (itemInfo.videoDetails.isLive) {
                        // Livestream
                        await MasterHandlerJS.handleSingleTrack(message.guild, {
                            type: 'YoutubeStream',
                            title: itemInfo.videoDetails.title,
                            playLink: 'https://www.youtube.com/watch?v=' + itemInfo.videoDetails.videoId,
                            duration: '?',
                            thumbnail: message.client.SERVICE_LOGO_LINKS.youtube,
                            author: message.author.id,
                            failedTimes: 0
                        }, isPlayNext)
                    } else {
                        // Normal video
                        await MasterHandlerJS.handleSingleTrack(message.guild, {
                            type: 'YoutubeVideo',
                            title: itemInfo.videoDetails.title,
                            playLink: 'https://www.youtube.com/watch?v=' + itemInfo.videoDetails.videoId,
                            duration: parseInt(itemInfo.videoDetails.lengthSeconds),
                            thumbnail: message.client.SERVICE_LOGO_LINKS.youtube,
                            author: message.author.id,
                            failedTimes: 0
                        }, isPlayNext)
                    }

                    await MasterHandlerJS.sendSingleTrackAddedEmbed(message, itemInfo.videoDetails.title, `https://www.youtube.com/watch?v=${itemInfo.videoDetails.videoId}`)


                    const PLAYBACK = require('../musicHandler/PLAYBACK')
                    return PLAYBACK(message)

                } catch (error) {
                    // console.log(error)
                    return message.reply(message.client.reply_messages.warnings.youtube.wrong_link)
                }
            }
        }
    }
}