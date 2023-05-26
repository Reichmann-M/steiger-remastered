const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "loop",
    aliases: ['looping'],
    cooldown: 10,
    description: "Erstelle eine Endlosschleife des derzeit laufenden Tracks",
    async execute(message, updatePlayingMessage = true) {
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

            if (updatePlayingMessage) {
                const PlayingMessageJS = require('../util/playingMessage')
                await PlayingMessageJS.update(message)
            }
        }
    }
}