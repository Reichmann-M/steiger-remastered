const util = require('util')
const fs = require('fs');
const {
    MessageEmbed
} = require('discord.js');
module.exports = {
    name: "ownersend",
    aliases: ['adminsend'],
    cooldown: 10,
    description: "Command only usable by owner.",
    async execute(message, args = undefined) {
        if (message.author.id == message.client.ownerID) {
            const botOwner = await message.client.users.fetch(message.client.ownerID)
            const messageText = args.join(' ')
            try {
                const guildsJSON = JSON.parse(fs.readFileSync('./cache/guilds.json'))
                guildsJSON.forEach(guild => {
                    const sendingChannel = message.client.channels.cache.get(guild.messageChannelId);
                    console.log(sendingChannel)
                    sendingChannel.send(new MessageEmbed({
                        color: "#00ff00",
                        description: messageText,
                        footer: {
                            text: `Developer: ${botOwner.username} aka Reichmann-M (github.com/reichmann-m), v${message.client.version}`,
                            icon_url: botOwner.displayAvatarURL()
                        }
                    }))
                });
            } catch (error) {
                console.log(error)
            }

        } else return message.reply(`**Sorry this command is only usable by the bot owner/dev (<@328213965299515393>) :/**`)
    }
}