// VimeoLinkHandler

// Vimeo video link: https://vimeo.com/57129689

const {
    MessageEmbed
} = require('discord.js');
const vimeo = require('../include/vimeo-video-streamUrl/main')
const MasterHandlerJS = require('./MASTERHANDLER')
// const fs = require('fs')
// const util = require('util')

module.exports = {
    async handle(message, vimeoLink = undefined, isPlayNext = false, isShufflePlay = false) {

        const videoDetails = await vimeo.getVideoSourceUrls(vimeoLink.split('.com/')[1])
        if (videoDetails == 'wrong vimeo id') return message.reply('Konnte Vimeo-Link nicht abspielen')
        if (videoDetails == 'site layout changed') return message.reply('Das Backend von Vimeo hat sich verändert. Bitte dem Entwickler des Bot mitteilen. Danke <3')
        
        if (videoDetails.streamMp4.length == 0) return message.reply('Konnte Vimeo-Link nicht abspielen')

        videoDetails.streamMp4.sort((a,b) => (a.width > b.width) ? 1 : ((b.width > a.width) ? -1 : 0)); 
               
        await MasterHandlerJS.handleSingleTrack(message.guild, {
            type: 'WebStream',
            title: vimeoLink,
            playLink: videoDetails.streamMp4[0].url,
            duration: '?',
            thumbnail: message.client.SERVICE_LOGO_LINKS.vimeo,
            author: message.author.id,
            failedTimes: 0
        }, isPlayNext)

        await MasterHandlerJS.sendSingleTrackAddedEmbed(message, vimeoLink, vimeoLink)

        const PLAYBACK = require('../musicHandler/PLAYBACK')
        return PLAYBACK(message)

    }
}