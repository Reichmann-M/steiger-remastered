const { MessageEmbed } = require('discord.js');
const UtilMethods = require('../util/UtilMethods.js')
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
            message.reply(new MessageEmbed({
                color: message.client.color,
                description: `[${message.guild.queue[0].title}](${message.guild.queue[0].playLink}) [<@${message.guild.queue[0].author}>]`,
                footer: {
                    text: generateNowplayingFooter(songDuration, alreadyPlayedSongTime)
                }
            }))
        }
    }
}

const generateNowplayingFooter = (songDuration, alreadyPlayedSongTime) => {
    const tileCount = 40;
    var sPlayBar = ''
    var sPlayTime = ''
    if (songDuration != '?') {
        const percentPlayed = Math.round(alreadyPlayedSongTime / songDuration * 100);

        const howManyTillZero = percentPlayed - 1;
        const howManyTillHundred = 100 - percentPlayed;

        const preTileCount = Math.round(howManyTillZero / 100 * tileCount)
        const pastTileCount = Math.round(howManyTillHundred / 100 * tileCount)

        if (preTileCount + pastTileCount > tileCount) {
            preTileCount--;
        }

        for (let i = 0; i < preTileCount; i++) {
            sPlayBar = sPlayBar + '▬';
        }
        sPlayBar = sPlayBar + '🔵'
        for (let i = 0; i < pastTileCount; i++) {
            sPlayBar = sPlayBar + '▬';
        }
        sPlayTime = `${UtilMethods.getFormattedSeconds(Math.round(alreadyPlayedSongTime))} / ${UtilMethods.getFormattedSeconds(songDuration)}`
    } else {
        sPlayBar = '🔴▶️ LIVE seit:'
        sPlayTime = `${UtilMethods.getFormattedSeconds(Math.round(alreadyPlayedSongTime))}`
    }
    return `${sPlayBar} ${sPlayTime}`;
}