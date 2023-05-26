// MASTERHANDLER
// this module handles objects of single tracks or tracks inside playlists and pushes them to the correspondend guild queue

const {
    MessageEmbed
} = require('discord.js');

module.exports.handlePlaylist = function (guild, playlistItems = undefined, isShufflePlay = false) {
    isShufflePlay ? playlistItems = playlistItems.sort(() => Math.random() - 0.5) : playlistItems = playlistItems
    
    playlistItems.forEach(item => {
        guild.queue.push(item)
    });
}

module.exports.handleSingleTrack = function (guild, trackItem = undefined, isPlayNext = false) {
    if (guild.queue.length == 0) {
        guild.queue.push(trackItem)
    } else {
        if (isPlayNext) {
            guild.queue.splice(1, 0, trackItem)
        } else {
            guild.queue.push(trackItem)
        }
    }
}

// Title Added Embeds

module.exports.sendSingleTrackAddedEmbed = function(message, title, streamLink) {
    if (message.guild.queue.length > 1) {
        const titleAddedEmbed = new MessageEmbed({
            color: message.client.color,
            description: `[${title}](${streamLink}) hinzugefügt`
        })
        message.reply(titleAddedEmbed)
    }    
}