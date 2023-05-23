const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "stop",
    aliases: ['clear', 'clean', 'empty'],
    cooldown: 10,
    description: "Lösche alles in der derzeitigen Warteschlange",
    async execute(message) {
        if (message.guild.queue.length == 0) {
            await message.react('🚫')
        } else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            try {
                await message.guild.playingMessage.delete()
                message.guild.playingMessage = null;
            } catch (error) {
                
            }
            message.guild.queue = []
            message.guild.nowPlaying = false;
            message.guild.isLooped = false;
            message.guild.loopCount = 0
            message.guild.dispatcher.destroy()
            message.guild.dispatcher = null;
            await message.react('👌')
            message.guild.me.setNickname("");
        }
    }
}