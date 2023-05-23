const fs = require('fs')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "version",
    aliases: ['v'],
    cooldown: 10,
    description: "Lasse Dir die derzeitige Bot-Version anzeigen",
    async execute(message) {
        const packageJSONFile = JSON.parse(fs.readFileSync('./package.json'))
        
        const versionEmbed = new MessageEmbed({
            color: message.client.color,
        })
        versionEmbed.setTitle(`${packageJSONFile.name}`)
        versionEmbed.setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://www.github.com/reichmann-m')
        versionEmbed.setTimestamp()

        
        versionEmbed.addField('Version:', packageJSONFile.version)

        const botOwner = await message.client.users.fetch(message.client.ownerID)

        versionEmbed.setFooter(`Developer: ${botOwner.username} aka Reichmann-M`, botOwner.displayAvatarURL())
        message.reply(versionEmbed)
    }
}