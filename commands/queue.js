const UtilMethods = require('../util/UtilMethods.js')
module.exports = {
    name: "queue",
    aliases: ['q'],
    cooldown: 5,
    description: "Lasse Dir alle Tracks in der Warteschlange anzeigen",
    execute(message) {
        const queue = message.guild.queue
        if (queue.length == 0) {
            return message.reply('Nichts in der Warteschlange.')
        } else {
            message.reply(generateQueuePage)
        }
    }
}

const generateQueuePage = (queue) => {
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

        const sDuration = UtilMethods.getFormattedSeconds(item.duration)
        const howManyWhiteSpace = 69 - tracktitle.length - sDuration.length
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
    return(sQueuePage + '\n' + 'Weitere ' + (queue.length-i+1) + ' Tracks in der Warteschlange```')
}