const { del } = require('request-promise');
const canModifyQueueJS = require('../util/canModifyQueue')
const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "delete",
    aliases: ['del'],
    cooldown: 5,
    description: "Lösche einen Track aus der Warteschlange",
    async execute(message, args) {
        if (message.guild.queue.length == 0) {
            await message.react("🚫")
        } else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }          
            if (args[0] == undefined) return message.reply(`Du musst eine Zahl von 1 bis ${message.guild.queue.length} mit übergeben`)
            if (!(Number.isInteger(parseInt(args[0])))) return message.reply(`Du musst eine Zahl von 1 bis ${message.guild.queue.length} mit übergeben`);

            const delNumber = parseInt(args[0])
            
            if (!(delNumber > 0 && delNumber <= message.guild.queue.length)) return message.reply(`Du musst eine Zahl von 1 bis ${message.guild.queue.length} mit übergeben`)

            message.channel.send(new MessageEmbed({
                color: message.client.color,
                description: `[${message.guild.queue[delNumber-1].title}](${message.guild.queue[delNumber-1].playLink}) gelöscht`
            }))
            message.guild.queue.splice(delNumber-1,1)
             
            await message.react("👌")
        }
    }
}