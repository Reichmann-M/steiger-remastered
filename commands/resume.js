const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "resume",
    aliases: ['unpause'],
    cooldown: 10,
    description: "Spiel den Track weiter, wenn er pausiert ist",
    async execute(message) {
        if (message.guild.nowPlaying) {
            await message.react('🚫')
        }
        else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.nowPlaying = true
            await message.react("▶️")
            message.guild.dispatcher.resume()
            message.guild.me.setNickname(`🔊 ${message.client.user.username}`);
            const PlayingMessageJS = require('../util/playingMessage')
            await PlayingMessageJS.update(message)
        }
    }
}