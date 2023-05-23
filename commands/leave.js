const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "leave",
    aliases: ['l', 'd', 'disconnect'],
    cooldown: 10,
    description: "Disconnecte mich vom Sprachkanal",
    async execute(message) {
        if (message.guild.usedVoiceChannel != null) {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            message.guild.usedVoiceChannel.leave()
            await message.react('👋')
        }
    }
}