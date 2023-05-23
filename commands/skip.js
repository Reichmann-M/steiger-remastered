const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "skip",
    aliases: ['s'],
    cooldown: 3,
    description: "Überspringe den derzeitigen Track",
    async execute(message) {
        if (message.guild.queue.length == 0) {
            await message.react("🚫")
        } else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.dispatcher.end()
            message.guild.dispatcher = null;
            message.guild.isLooped = false;
            message.guild.loopCount = 0
            await message.react("👌")
        }
    }
}