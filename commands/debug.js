const util = require('util')
module.exports = {
    name: "debug",
    aliases: ['db'],
    cooldown: 10,
    description: "Debuginformationen",
    async execute(message) {
        if (message.author.id == message.client.ownerID) {
            return message.reply(`${message.client.user.username} connected in **${message.client.guilds.cache.size}** guilds !\n${message.client.user.username} connected in **${message.client.voice.connections.size}** channels !`);
        } else return message.reply(`**Sorry this command is only usable by the bot owner/dev (<@328213965299515393>) :/**`)
    }
}