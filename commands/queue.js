const util = require('util')
module.exports = {
    name: "queue",
    aliases: ['q'],
    cooldown: 5,
    description: "Lasse Dir alle Tracks in der Warteschlange anzeigen",
    async execute(message) {
        // console.log(message.guild.queue) // remove for production

        const queue = message.guild.queue
        if (queue.length == 0) {
            return message.reply('Nichts in der Warteschlange.')
        } else {
            var sQueuePage = '```'
            var i = 1;
            // Maximum 69 per line
            queue.every(item => {
                var sArt = ''
                if (item.artist != null) {
                    sArt = item.artist + ' - '
                } else if (item.artists != null) {
                    sArt = item.artists[0] + ' - '
                }
                var tracktitle = item.title;
                if (tracktitle.length > 54) {
                    tracktitle = tracktitle.substring(0,54) + '…'
                }
                tracktitle = i + '. ' + sArt + tracktitle
                sQueuePage = sQueuePage + tracktitle

                const sDuration = this.getFormattedSeconds(item.duration)
                const howManyWhiteSpace = 69 - tracktitle.length - sDuration.length
                // console.log(howManyWhiteSpace)
                for (let i = 0; i < howManyWhiteSpace; i++) {
                    sQueuePage = sQueuePage + ' '
                }
                sQueuePage = sQueuePage + sDuration + '\n'

                i++;
                if (i > 27) {
                    return false
                }
                return true
            });
            sQueuePage = sQueuePage + '\n' + 'Weitere ' + (queue.length-i+1) + ' Tracks in der Warteschlange```'

            message.reply(sQueuePage)

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