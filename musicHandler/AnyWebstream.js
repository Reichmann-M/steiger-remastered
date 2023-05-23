// Any Webstream Handler
// https://streams.regenbogen.de/rr-mannheim-64-mp3?usid=0-0-L-M-M-06

const {
    MessageEmbed
} = require('discord.js');
const MasterHandlerJS = require('./MASTERHANDLER')
// const fs = require('fs')
const util = require('util')

module.exports = {
    async handle(message, streamLink = undefined, isPlayNext = false, isShufflePlay = false) {

        await MasterHandlerJS.handleSingleTrack(message.guild, {
            type: 'WebStream',
            title: streamLink,
            playLink: streamLink,
            duration: '?',
            thumbnail: message.client.SERVICE_LOGO_LINKS.webstreams,
            author: message.author.id,
            failedTimes: 0
        }, isPlayNext)

        await MasterHandlerJS.sendSingleTrackAddedEmbed(message, streamLink, streamLink)

        const PLAYTRACK = require('../musicHandler/PLAYTRACK')
        return PLAYTRACK(message)
    }
}