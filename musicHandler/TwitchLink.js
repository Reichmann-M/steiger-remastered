// TwitchLinkHandler

// VOD-Link: https://www.twitch.tv/videos/850853103
// Livestream-Link: https://www.twitch.tv/adorable_kittens
// Clip-Link: https://www.twitch.tv/shroud/clip/UnsightlyEnergeticSproutDuDudu
// const twitch = require('twitch-get-stream')
const twitch = require('twitch-m3u8') //('kimne78kx3ncx6brgo4mv6wki5h1ko');

const {
    MessageEmbed
} = require('discord.js');
// const fs = require('fs')
// const util = require('util')
const MasterHandlerJS = require('./MASTERHANDLER')

module.exports = {
    async handle(message, twitchLink = undefined, isPlayNext = false, isShufflePlay = false) {

        var resolved_url = '';
        var resolved_title = ''
        try {
            if (twitchLink.includes('/videos/')) {
                const vodID = twitchLink.split('/videos/')[1]
                const vod_stream_urls = await twitch.getVod(vodID)
                resolved_url = vod_stream_urls[vod_stream_urls.length - 1].url
                resolved_title = vodID;
                await MasterHandlerJS.sendSingleTrackAddedEmbed(message, twitchLink, twitchLink)
            } else {
                const channelName = twitchLink.split('.tv/')[1]
                const live_stream_urls = await twitch.getStream(channelName)
                resolved_url = live_stream_urls[live_stream_urls.length - 1].url
                resolved_title = channelName;
                await MasterHandlerJS.sendSingleTrackAddedEmbed(message, channelName, twitchLink)
            }
            message.reply('Weil Twitch versucht Werbung zu laden und diese vom Bot geblockt wird, dauert es immer ca. 10 Sekunden bis der Audio Stream geladen hat...')
            await MasterHandlerJS.handleSingleTrack(message.guild, {
                type: 'WebStream',
                title: resolved_title,
                playLink: resolved_url,
                duration: '?',
                thumbnail: message.client.SERVICE_LOGO_LINKS.twitch,
                author: message.author.id,
                failedTimes: 0
            }, isPlayNext)

            const PLAYTRACK = require('../musicHandler/PLAYTRACK')
            return PLAYTRACK(message)
        } catch (error) {
            message.reply('Twitch-Link konnte nicht abgespielt werden.')
        }
    }
}