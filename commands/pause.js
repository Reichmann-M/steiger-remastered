const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "pause",
    aliases: ['break'],
    cooldown: 10,
    description: "Pausiere den derzeitigen Track",
    async execute(message) {
        if (message.guild.nowPlaying == false) {
            await message.react('🚫')
        }
        else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.nowPlaying = false
            await message.react("⏸️")
            message.guild.dispatcher.pause(true)
            message.guild.me.setNickname(`⏸️ ${message.client.user.username}`);
            const PlayingMessageJS = require('../util/playingMessage')
            await PlayingMessageJS.update(message)
        }
    }
}