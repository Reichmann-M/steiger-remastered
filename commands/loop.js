const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "loop",
    aliases: ['looping'],
    cooldown: 10,
    description: "Erstelle eine Endlosschleife des derzeitig laufenden Tracks",
    async execute(message) {
        if (message.guild.queue.length == 0) {
            await message.react("🚫")
        } else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            if (message.guild.isLooped) {
                message.guild.isLooped = false;
                await message.react("🚫")
                await message.react("🔂")
            } else {
                message.guild.isLooped = true;
                await message.react("🔂")
            }

            const PlayingMessageJS = require('../util/playingMessage')
            await PlayingMessageJS.update(message)
        }
    }
}