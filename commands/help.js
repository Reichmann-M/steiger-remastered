const fs = require('fs')
const {
    MessageEmbed
} = require('discord.js')
module.exports = {
    name: "help",
    aliases: ['h', 'helpp', 'hellp', 'hepl'],
    cooldown: 10,
    description: "Lasse Dir alle möglichen Commands anzeigen",
    async execute(message) {

        const helpEmbed = new MessageEmbed({
            color: message.client.color,
        })
        helpEmbed.setTitle(`${message.client.user.username} Remastered: Hilfeseite`)
        helpEmbed.setDescription(`Play YouTube, Spotify, Soundcloud, Vimeo, Twitch, Radio.de & and any audio-compatible webstream 🤗`)
        helpEmbed.setAuthor(message.client.user.username, message.client.user.displayAvatarURL(), 'https://www.github.com/reichmann-m')
        helpEmbed.setTimestamp()

        const commandFileNames = fs.readdirSync('./commands').filter(files => files.endsWith('.js'))
        for (const fileName of commandFileNames) {
            console.log(fileName)
            const command = require(`./${fileName}`)
            helpEmbed.addField(`${message.client.prefix}${command.name}`, `${command.description} [Aliases: ${command.aliases}]`)
        }

        const botOwner = await message.client.users.fetch(message.client.ownerID)

        helpEmbed.setFooter(`Developer: ${botOwner.username} aka Reichmann-M (github.com/reichmann-m), v${message.client.version}`, botOwner.displayAvatarURL())
        message.reply(helpEmbed)
    }
}