const radionet_streamurl = require('../include/radionet-streamurl/main')
const RadioStationLinkJS = require('../musicHandler/RadioNetLink')
const util = require('util')
module.exports = {
    name: "radioplay",
    aliases: ['rp'],
    cooldown: 10,
    description: "Spiele direkt eine Station von Radio.de ab",
    async execute(message, searchTerm) {
        const {
            channel
        } = message.member.voice

        if (!channel) return message.reply(message.client.reply_messages.warnings.playingEvent.no_voice_channel)
        if (message.guild.me.voice.channel != null && channel !== message.guild.me.voice.channel) return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_voice_channel)

        if (!searchTerm.length) return message.reply(`${message.client.reply_messages.warnings.playingEvent.no_arguments.first} ${message.client.prefix}${message.client.reply_messages.warnings.playingEvent.no_arguments.second}`)
        for (const arg in searchTerm) {
            if (searchTerm[arg].includes('\n')) {
                return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_play_query)
            }
        };

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_connection_permission);
        if (!permissions.has("SPEAK"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_speaking_permission);
        
        
        var searchResults = await radionet_streamurl.getSearchResults(searchTerm.join(' '))

        // Filter out every station with name == undefined
        searchResults = searchResults.filter(function (obj) {
            return obj.name !== undefined;
        });

        if (searchResults.length == 0) {
            return message.reply('Sorry, keine Radiostation gefunden')
        }

        if (searchResults.length > 0) {
            searchResults = searchResults.splice(0, 10)
        }

        var stationLink = '';
        searchResults.every(station => {
            if (station.name != undefined) {
                stationLink = station.url
                return false
            }
            return true
        })
        if (stationLink == '') {
            return message.reply('Sorry, keine Radiostation gefunden')
        }

        await RadioStationLinkJS.handle(message, stationLink)
    }
}