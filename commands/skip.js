const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "skip",
    aliases: ['s'],
    cooldown: 3,
    description: "Überspringe den derzeitigen Track",
    execute(message) {
        if (message.guild.queue.length == 0) {
            message.react("🚫")
        } else {
            if (!(canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.queue.shift();
            message.guild.dispatcher.end()
            message.guild.dispatcher = null;
            message.guild.isLooped = false;
            message.guild.loopCount = 0
            message.react("👌")
        }
    }
}