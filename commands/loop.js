const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "loop",
    aliases: ['looping'],
    cooldown: 10,
    description: "Erstelle eine Endlosschleife des derzeit laufenden Tracks",
    execute(message, updatePlayingMessage = true) {
        if (message.guild.queue.length == 0) {
            return message.react("🚫")
        } else {
            if (!(canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            if (message.guild.isLooped) {
                message.guild.isLooped = false;
                message.react("🚫")
                message.react("🔂")
            } else {
                message.guild.isLooped = true;
                message.react("🔂")
            }

            if (updatePlayingMessage) {
                const PlayingMessageJS = require('../util/playingMessage')
                PlayingMessageJS.update(message)
            }
        }
    }
}