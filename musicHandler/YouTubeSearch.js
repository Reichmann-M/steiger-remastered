// YouTubeSearchHandler

const {
    MessageEmbed
} = require('discord.js')
// const fs = require('fs')
// const util = require('util')
// const youtube = require('scrape-youtube').default;
const failedFetchAutoRetry = require('../util/failedFetchAutoRetry')
const MasterHandlerJS = require('./MASTERHANDLER')
module.exports = {
    async handle(message, searchQuery = undefined, isPlayNext = false, isShufflePlay = false) {

        console.log(`[🎩${message.client.bot_config_number}]🐛 Searching for |${searchQuery}| on YouTube...`)
        var ytResults = await failedFetchAutoRetry('youtube.search-video', `${searchQuery}`)
        
        if (ytResults == null || ytResults.videos.length == 0) {
            // console.log('no direct youtube search results') // remove for production
            console.log(`[🎩${message.client.bot_config_number}]❗ No results found for |${searchQuery}|`)
            message.channel.send(new MessageEmbed({
                color: "#e60000",
                description: `❗ YouTube-Suche **${searchQuery}** ergab keine Treffer`
            }))
            return message.guild.queue[0] = null
        }

        // Block video if by Drachenlord
        var isDrachenlord = false;
        do {
            isDrachenlord = false;
            if (ytResults.videos.length == 0) {
                console.log(`[🎩${message.client.bot_config_number}]❗ No results found for |${searchQuery}|`)
                message.channel.send(new MessageEmbed({
                    color: "#e60000",
                    description: `❗ YouTube-Suche **${searchQuery}** ergab keine Treffer`
                }))
                return message.guild.queue[0] = null
            }
            if (ytResults.videos[0].channel.link == "https://www.youtube.com/c/DrachenLord" || ytResults.videos[0].channel.link == "https://www.youtube.com/channel/UCm3_j4RLEzgMovQTRPx47MQ") {
                ytResults.videos.shift();
                isDrachenlord = true;
            }
        } while (isDrachenlord);



        await MasterHandlerJS.handleSingleTrack(message.guild, {
            type: 'YoutubeVideo',
            title: ytResults.videos[0].title,
            playLink: ytResults.videos[0].link,
            duration: ytResults.videos[0].duration,
            thumbnail: message.client.SERVICE_LOGO_LINKS.youtube,
            author: message.author.id,
            failedTimes: 0
        }, isPlayNext)
        
        await MasterHandlerJS.sendSingleTrackAddedEmbed(message, ytResults.videos[0].title, ytResults.videos[0].link)

        const PLAYBACK = require('../musicHandler/PLAYBACK')
        return PLAYBACK(message)
        
    }
}