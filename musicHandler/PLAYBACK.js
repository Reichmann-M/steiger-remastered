// const ytdl = require('youtube-dl')
// const ytdl = require('ytdl-core-discord');
// const ytdl = require('ytdl-core')
// const ytdl = require('discord-ytdl-core')
const scdl = require("soundcloud-downloader").default;
const { MessageEmbed } = require('discord.js')

const SpotifyYoutubeIntegrationJS = require('../include/SpotifyYoutubeIntegration')
const failedFetchAutoRetry = require('../util/failedFetchAutoRetry')
const play = module.exports = async (message) => {
    var discord_server = message.guild;
    if (discord_server.queue.length == 0) {
        return;
    }

    if (discord_server.dispatcher != undefined) {
        if (discord_server.dispatcher.paused == true) {
            return;
        }
    }

    if (discord_server.nowPlaying) {
        return;
    }
    // console.log(`Trying to play ${discord_server.queue[0].type}: ${discord_server.queue[0].title}`) // remove for production

    if (!discord_server.usedVoiceChannel) {
        discord_server.usedVoiceChannel = message.member.voice.channel
    }

    // Declare stream variables
    var stream = null;
    var streamOptions = {}

    if (discord_server.queue[0].type == 'YoutubeVideo' || discord_server.queue[0].type == 'YoutubeStream') {
        
        stream = await failedFetchAutoRetry('ytdl', discord_server.queue[0].playLink)
        if (stream == null) {
            console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${discord_server.queue[0].playLink}|`)
            message.channel.send(new MessageEmbed({
                color: "#e60000",
                description: `❗ Video **${discord_server.queue[0].title}** nicht verfügbar [3 failed attempts to fetch video stream]`
            }))
            discord_server.queue.shift()
            discord_server.dispatcher = null;
            discord_server.nowPlaying = false
            discord_server.isLooped = false;
            discord_server.me.setNickname("");
            return play(message);
        }       
        
        streamOptions = {
            type: 'opus'
        }
    } else if (discord_server.queue[0].type == 'Soundcloud') {

        stream = await scdl.download(discord_server.queue[0].playLink, 'gi3TTq7WE8J3QwqBwG5PaY639Ufl7RLH')
        streamOptions = {
            type: 'unknown'
        }
    } else if (discord_server.queue[0].type == 'WebStream') {
        stream = discord_server.queue[0].playLink,
            streamOptions = {
                type: 'unknown'
            }
    } else if (discord_server.queue[0].type == 'SpotifyItem') {

        // console.log(`Trying to play: ${discord_server.queue[0].title}`) // remove for production
        await SpotifyYoutubeIntegrationJS.handle(message, discord_server.queue[0])
        if (discord_server.queue[0] == null) {
            discord_server.queue.shift();
            stream = null;
            discord_server.dispatcher = null;
            discord_server.nowPlaying = false
            discord_server.isLooped = false;
            discord_server.me.setNickname("");
        }
        return play(message)
    }


    console.log(`[🎩${message.client.bot_config_number}]✅ Playing ${discord_server.queue[0].title} (${discord_server.queue[0].playLink}) to voicechannel ${discord_server.usedVoiceChannel.name} (${discord_server.usedVoiceChannel.id})`)
    discord_server.connection = await discord_server.usedVoiceChannel.join()
    
    // Bot selfdeafens and serverdeafens itself
    try {
        discord_server.connection.voice.setSelfDeaf(true)
        discord_server.connection.voice.setDeaf(true)
    } catch (error) {
        // console.log(error) // remove for production
    }
    
    
    discord_server.dispatcher = discord_server.connection
        .play(stream, streamOptions)
        // .play(stream)
        .on("error", async (err) => {
            console.log(err)
            discord_server.queue.shift()
            stream = null;
            discord_server.dispatcher = null;
            discord_server.nowPlaying = false
            discord_server.isLooped = false;
            discord_server.loopCount = 0
            discord_server.me.setNickname("");
            try {
                await discord_server.playingMessage.delete()
                discord_server.playingMessage = null;
                stream.destroy()
            } catch (error) {
                // console.log(error) // remove for production
            }
            return play(message);
        })
        .on("finish", async () => {
            discord_server.nowPlaying = false
            stream = null;
            discord_server.dispatcher = null;
            discord_server.me.setNickname("");
            try {
                await discord_server.playingMessage.delete()
                discord_server.playingMessage = null;
                stream.destroy()
            } catch (error) {
                // console.log(error) // Can be removed for production
            }
            if (!(discord_server.isLooped)) {
                discord_server.queue.shift()
                return play(message);
            } else {
                // LOOP Activated
                discord_server.loopCount = discord_server.loopCount + 1
                return play(message);
            }
        })

    // Maximum Audio Quality
    discord_server.dispatcher.setBitrate('auto')
    discord_server.dispatcher.setVolumeLogarithmic(discord_server.volume / 100)


    discord_server.nowPlaying = true;

    discord_server.me.setNickname(`🔊 ${message.client.user.username}`);
    const PlayingMessageJS = require('../util/playingMessage')
    await PlayingMessageJS.update(message)
}

/* 
.p https://www.youtube.com/watch?v=PXt9Km8A74s
*/