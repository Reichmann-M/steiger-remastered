// Play Command !!!

const {
    MessageEmbed
} = require('discord.js')

// const fs = require('fs')
module.exports = {
    name: "play",
    aliases: ['p', 'pl', 'playmusic', 'playsong'],
    cooldown: 3,
    description: "Spiele YouTube ab",
    async execute(message, args = undefined, isPlayNext = false, isShufflePlay = false) {
        const {
            channel
        } = message.member.voice

        if (!channel) return message.reply(message.client.reply_messages.warnings.playingEvent.no_voice_channel)
        if (message.guild.me.voice.channel != null && channel !== message.guild.me.voice.channel) return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_voice_channel)

        if (!args.length) return message.reply(`${message.client.reply_messages.warnings.playingEvent.no_arguments.first} ${message.client.prefix}${message.client.reply_messages.warnings.playingEvent.no_arguments.second}`)
        for (const arg in args) {
            if (args[arg].includes('\n')) {
                return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_play_query)
            }
        };

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_connection_permission);
        if (!permissions.has("SPEAK"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_speaking_permission);


        if (args[0].includes('https://') && args.length > 1) return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_play_query)
        const sSearchQuery = args.join(' ')

        /* Maybe necessary, keep just in case

            // message.guild.usedVoiceChannel = channel

        */

        // Link
        if (sSearchQuery.includes('https://') || sSearchQuery.includes('http://')) {
            // YouTube Video oder Stream
            if (sSearchQuery.includes('https://www.youtube.') || sSearchQuery.includes('https://youtu.be/')) {
                // return message.reply(new MessageEmbed({
                //     color: "#FF0000",
                //     description: "⛔⚠️ YouTube & Spotify Module temporarily disabled. YT Download Library having issues atm due to API Changes.\nMeanwhile we\'re trying to fix the bugs and alternative modules are being tested currently. We\'re sorry for the inconvenience 😔"
                // }))

                const YouTubeLinkJS = require('../musicHandler/YouTubeLink')
                await YouTubeLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
            // Spotify
            else if (sSearchQuery.includes('https://open.spotify.com/')) {
                // return message.reply(new MessageEmbed({
                //     color: "#FF0000",
                //     description: "⛔⚠️ YouTube & Spotify Module temporarily disabled. YT Download Library having issues atm due to API Changes.\nMeanwhile we\'re trying to fix the bugs and alternative modules are being tested currently. We\'re sorry for the inconvenience 😔"
                // }))

                const SpotifyLinkJS = require('../musicHandler/SpotifyLink')
                await SpotifyLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
            // Radio.de oder radio.net
            else if (sSearchQuery.includes('https://www.radio.net/s/') || sSearchQuery.includes('https://www.radio.de/s/')) {
                const RadioStationLinkJS = require('../musicHandler/RadioNetLink')
                await RadioStationLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
            // Twitch
            else if (sSearchQuery.includes('https://www.twitch.tv/')) {
                const TwitchLinkJS = require('../musicHandler/TwitchLink')
                await TwitchLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
            // Vimeo
            else if (sSearchQuery.includes('https://vimeo.com/')) {
                const VimeoLinkJS = require('../musicHandler/VimeoLink')
                await VimeoLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
            // Soundcloud
            else if (sSearchQuery.includes('https://soundcloud.com/')) {
                const SoundCloudLinkJS = require('../musicHandler/SoundCloudLink')
                await SoundCloudLinkJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }




            // jegliche Art von Webstreams
            else {
                const AnyWebstreamJS = require('../musicHandler/AnyWebstream')
                await AnyWebstreamJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
            }
        }

        // No Link -> YouTube Search
        else {
            // return message.reply(new MessageEmbed({
            //     color: "#FF0000",
            //     description: "⛔⚠️ YouTube & Spotify Module temporarily disabled. YT Download Library having issues atm due to API Changes.\nMeanwhile we\'re trying to fix the bugs and alternative modules are being tested currently. We\'re sorry for the inconvenience 😔"
            // }))

            const YouTubeSearchJS = require('../musicHandler/YouTubeSearch')
            await YouTubeSearchJS.handle(message, sSearchQuery, isPlayNext, isShufflePlay)
        }

    }
}