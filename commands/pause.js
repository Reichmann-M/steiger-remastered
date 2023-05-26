const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "pause",
    aliases: ['break'],
    cooldown: 10,
    description: "Pausiere den derzeitigen Track",
    execute(message, updatePlayingMessage = true) {
        if (message.guild.nowPlaying == false) {
            return message.react('🚫')
        }
        else {
            if (!(canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.nowPlaying = false
            message.react("⏸️")
            message.guild.dispatcher.pause()
            message.guild.me.setNickname(`⏸️ ${message.client.user.username}`);
            
            if (updatePlayingMessage) {
                const PlayingMessageJS = require('../util/playingMessage')
                PlayingMessageJS.update(message)
            }
        }
    }
}