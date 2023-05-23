// RadioLinkHandler

const {
    MessageEmbed
} = require('discord.js');
const radionet_streamurl = require('../include/radionet-streamurl/main')
const MasterHandlerJS = require('./MASTERHANDLER')
// const fs = require('fs')
const util = require('util')

module.exports = {
    async handle(message, radioLink = undefined, isPlayNext = false, isShufflePlay = false) {
        const stationInfo = await radionet_streamurl.getStationInfo(radioLink)
        if (stationInfo == 'wrong radio station link') return message.reply('Falscher Radio.net-Link');
        if (stationInfo == 'site layout changed') return message.reply('Das Backend von Radio.net hat sich verändert. Bitte dem Entwickler des Bot mitteilen. Danke <3')
        if (stationInfo.stream_urls.length == 0) return message.reply('Falscher Radio.net-Link');

        await MasterHandlerJS.handleSingleTrack(message.guild, {
            type: 'WebStream',
            title: radioLink,
            playLink: stationInfo.stream_urls[0],
            duration: '?',
            thumbnail: stationInfo.station_logo,
            author: message.author.id,
            failedTimes: 0
        }, isPlayNext)

        await MasterHandlerJS.sendSingleTrackAddedEmbed(message, stationInfo.station_name, radioLink)

        const PLAYBACK = require('../musicHandler/PLAYBACK')
        return PLAYBACK(message)
    }
}