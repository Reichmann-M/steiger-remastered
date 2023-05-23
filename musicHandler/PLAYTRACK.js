// const ytdl = require('youtube-dl')
// const ytdl = require('ytdl-core-discord');
// const ytdl = require('ytdl-core')
// const ytdl = require('discord-ytdl-core')
const scdl = require("soundcloud-downloader").default;
const { MessageEmbed } = require('discord.js')

const SpotifyYoutubeIntegrationJS = require('../include/SpotifyYoutubeIntegration')
const failedFetchAutoRetry = require('../util/failedFetchAutoRetry')
const play = module.exports = async (message) => {
    if (message.guild.queue.length == 0) {
        return;
    }

    if (message.guild.dispatcher != undefined) {
        if (message.guild.dispatcher.paused == true) {
            return;
        }
    }

    if (message.guild.nowPlaying) {
        return;
    }
    // console.log(`Trying to play ${message.guild.queue[0].type}: ${message.guild.queue[0].title}`) // remove for production

    if (!message.guild.usedVoiceChannel) {
        message.guild.usedVoiceChannel = message.member.voice.channel
    }

    // Declare stream variables
    var stream = null;
    var streamOptions = {}

    if (message.guild.queue[0].type == 'YoutubeVideo' || message.guild.queue[0].type == 'YoutubeStream') {
        
        stream = await failedFetchAutoRetry('ytdl', message.guild.queue[0].playLink)
        if (stream == null) {
            console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${message.guild.queue[0].playLink}|`)
            message.channel.send(new MessageEmbed({
                color: "#e60000",
                description: `❗ Video **${message.guild.queue[0].title}** nicht verfügbar [3 failed attempts to fetch video stream]`
            }))
            message.guild.queue.shift()
            message.guild.dispatcher = null;
            message.guild.nowPlaying = false
            message.guild.isLooped = false;
            message.guild.me.setNickname("");
            return play(message);
        }       
        
        streamOptions = {
            type: 'opus'
        }
    } else if (message.guild.queue[0].type == 'Soundcloud') {

        stream = await scdl.download(message.guild.queue[0].playLink, 'gi3TTq7WE8J3QwqBwG5PaY639Ufl7RLH')
        streamOptions = {
            type: 'unknown'
        }
    } else if (message.guild.queue[0].type == 'WebStream') {
        stream = message.guild.queue[0].playLink,
            streamOptions = {
                type: 'unknown'
            }
    } else if (message.guild.queue[0].type == 'SpotifyItem') {

        // console.log(`Trying to play: ${message.guild.queue[0].title}`) // remove for production
        await SpotifyYoutubeIntegrationJS.handle(message, message.guild.queue[0])
        if (message.guild.queue[0] == null) {
            message.guild.queue.shift();
            stream = null;
            message.guild.dispatcher = null;
            message.guild.nowPlaying = false
            message.guild.isLooped = false;
            message.guild.me.setNickname("");
        }
        return play(message)
    }


    console.log(`[🎩${message.client.bot_config_number}]✅ Playing ${message.guild.queue[0].title} (${message.guild.queue[0].playLink}) to voicechannel ${message.guild.usedVoiceChannel.name} (${message.guild.usedVoiceChannel.id})`)
    message.guild.connection = await message.guild.usedVoiceChannel.join()
    
    // Bot selfdeafens and serverdeafens itself
    try {
        message.guild.connection.voice.setSelfDeaf(true)
        message.guild.connection.voice.setDeaf(true)
    } catch (error) {
        // console.log(error) // remove for production
    }
    
    
    message.guild.dispatcher = message.guild.connection
        .play(stream, streamOptions)
        // .play(stream)
        .on("error", async (err) => {
            console.log(err)
            message.guild.queue.shift()
            stream = null;
            message.guild.dispatcher = null;
            message.guild.nowPlaying = false
            message.guild.isLooped = false;
            message.guild.loopCount = 0
            message.guild.me.setNickname("");
            try {
                await message.guild.playingMessage.delete()
                message.guild.playingMessage = null;
                stream.destroy()
            } catch (error) {
                // console.log(error) // remove for production
            }
            return play(message);
        })
        .on("finish", async () => {
            message.guild.nowPlaying = false
            stream = null;
            message.guild.dispatcher = null;
            message.guild.me.setNickname("");
            try {
                await message.guild.playingMessage.delete()
                message.guild.playingMessage = null;
                stream.destroy()
            } catch (error) {
                // console.log(error) // Can be removed for production
            }
            if (!(message.guild.isLooped)) {
                message.guild.queue.shift()
                return play(message);
            } else {
                // LOOP Activated
                message.guild.loopCount = message.guild.loopCount + 1
                return play(message);
            }
        })

    // Maximum Audio Quality
    message.guild.dispatcher.setBitrate('auto')
    message.guild.dispatcher.setVolumeLogarithmic(message.guild.volume / 100)


    message.guild.nowPlaying = true;

    message.guild.me.setNickname(`🔊 ${message.client.user.username}`);
    const PlayingMessageJS = require('../util/playingMessage')
    await PlayingMessageJS.update(message)
}

/* 
.p https://www.youtube.com/watch?v=PXt9Km8A74s
*/