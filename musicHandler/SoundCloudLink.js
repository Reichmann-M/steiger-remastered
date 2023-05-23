// SoundCloudLinkHandler

// Soundcloud song link: https://soundcloud.com/jahseh-onfroy/bad-vibes-forever-feat-pnb-rock-trippie-redd

// Soundcloud user link: https://soundcloud.com/jahseh-onfroy

const {
    MessageEmbed
} = require('discord.js');
const SoundCloud = require("soundcloud-scraper");
const soundcloudClient = new SoundCloud.Client("gi3TTq7WE8J3QwqBwG5PaY639Ufl7RLH");
const MasterHandlerJS = require('./MASTERHANDLER')
// const fs = require('fs')
const util = require('util')

module.exports = {
    async handle(message, soundcloudLink = undefined, isPlayNext = false, isShufflePlay = false) {
        try {
            const trackInfo = await soundcloudClient.getSongInfo(soundcloudLink)

            await MasterHandlerJS.handleSingleTrack(message.guild, {
                type: 'Soundcloud',
                title: trackInfo.title,
                playLink: soundcloudLink,
                duration: trackInfo.duration / 1000,
                thumbnail: message.client.SERVICE_LOGO_LINKS.soundcloud,
                author: message.author.id,
                failedTimes: 0
            }, isPlayNext)
            const titleAddedEmbed = new MessageEmbed({
                color: message.client.color,
                description: `[${trackInfo.title}](${soundcloudLink}) von [${trackInfo.author.name}](${trackInfo.author.url}) hinzugefügt`
            })
            message.reply(titleAddedEmbed)


            const PLAYBACK = require('../musicHandler/PLAYBACK')
            return PLAYBACK(message)
        } catch (err) {
            try {
                const artistName = soundcloudLink.substring(soundcloudLink.lastIndexOf('/')+1)
                const artistInfo = await soundcloudClient.getUser(artistName)
                if (artistInfo.tracks.length == 0) {
                    return message.reply('Dieser Soundcloud-Artist hat keine Tracks.')
                }

                var queueConstruct = []
                artistInfo.tracks.forEach(track => {
                    queueConstruct.push({
                        type: 'Soundcloud',
                        playLink: track.url,
                        title: track.title,
                        duration: track.duration / 1000,
                        thumbnail: message.client.SERVICE_LOGO_LINKS.soundcloud,
                        author: message.author.id,
                        failedTimes: 0
                    })
                });


                await MasterHandlerJS.handlePlaylist(message.guild, queueConstruct, isShufflePlay)
                
                const titlesAddedEmbed = new MessageEmbed({
                    color: message.client.color,
                    description: `[${artistInfo.name}](${artistInfo.profile}) \n
                    **Neu:\n${queueConstruct.length}** Tracks hinzugefügt`,
                    image: {url: artistInfo.avatarURL},
                    thumbnail: {url: message.client.SERVICE_LOGO_LINKS.soundcloud}
                })
                message.reply(titlesAddedEmbed)

                const PLAYBACK = require('../musicHandler/PLAYBACK')
                return PLAYBACK(message)

            } catch (error) {
                console.log(error)
                return message.reply('Konnte Soundcloud-Link nicht abspielen.')
            }
        }

    }
}