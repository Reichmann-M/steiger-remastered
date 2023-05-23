const { MessageEmbed } = require('discord.js');
const util = require('util')
module.exports = {
    name: "nowplaying",
    aliases: ['np'],
    cooldown: 5,
    description: "Was wird gerade abgespielt?",
    async execute(message) {
        if (message.guild.queue.length == 0) {
            await message.react("🚫")
        } else {
            var songDuration = message.guild.queue[0].duration
            const alreadyPlayedSongTime = message.guild.dispatcher.streamTime / 1000;

            const tileCount = 40; // frei anpassbar
            var sPlayBar = ''
            var sPlayTime = ''
            if (songDuration != '?') {
                const percentPlayed = Math.round(alreadyPlayedSongTime / songDuration * 100);

                const howManyTillZero = percentPlayed - 1;
                const howManyTillHundred = 100 - percentPlayed;

                const preTileCount = Math.round(howManyTillZero / 100 * tileCount)
                const pastTileCount = Math.round(howManyTillHundred / 100 * tileCount)

                if (preTileCount+pastTileCount > tileCount) {
                    preTileCount--;
                }

                for (let i = 0; i < preTileCount; i++) {
                    sPlayBar = sPlayBar + '▬';
                }
                sPlayBar = sPlayBar + '🔵'
                for (let i = 0; i < pastTileCount; i++) {
                    sPlayBar = sPlayBar + '▬';
                }
                sPlayTime = `${this.getFormattedSeconds(Math.round(alreadyPlayedSongTime))} / ${this.getFormattedSeconds(songDuration)}`
            } else {
                sPlayBar = '🔴▶️ LIVE seit:'
                sPlayTime = `${this.getFormattedSeconds(Math.round(alreadyPlayedSongTime))}`
            }
            message.reply(new MessageEmbed({
                color: message.client.color,
                description: `[${message.guild.queue[0].title}](${message.guild.queue[0].playLink}) [<@${message.guild.queue[0].author}>]`,
                footer: {
                    text: `${sPlayBar} ${sPlayTime}`
                }
            }))
        }
    },
    getFormattedSeconds(normalSeconds) {
        var sFormatted = ''
        if (normalSeconds >= 3600) {
            var hours = Math.round(normalSeconds / 3600)
            normalSeconds = normalSeconds - (hours * 3600)
            sFormatted = `${hours}h`
        }
        if (normalSeconds >= 60) {
            var minutes = Math.round(normalSeconds / 60)
            normalSeconds = normalSeconds - (minutes * 60)
            sFormatted = `${sFormatted} ${minutes}m`
        }
        if (normalSeconds > 0) {
            sFormatted = `${sFormatted} ${normalSeconds}s`
        }
        return sFormatted;
    }    
}