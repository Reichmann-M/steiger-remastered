const fs = require('fs')
module.exports.generateRandomNumberString = (length) => {
    let number = '';
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }
    return number;
}


const guildRaw = {
    queue: []
}

const messageRaw = {
    client: {
        color: ''
    },
    guild: {
        me: {
            voice: {
                channel: undefined
            }
        },
        usedTextChannel: {
            send: function (replyMessage) { console.log(`Sending mock reply to used botchannel: ${replyMessage}`) }
        }
    },
    member: {
        voice: {
            channel: undefined
        }
    },
    reply: function (replyMessage) { console.log(`Sending mock reply message: ${replyMessage}`) }
}


module.exports.mockGuildWithEmptyQueue = () => {
    const guild = JSON.parse(JSON.stringify(guildRaw));
    return guild;
}

module.exports.mockGuildWithFilledQueue = () => {
    const guild = JSON.parse(JSON.stringify(guildRaw));
    for (let i = 0; i < 5; i++) {
        guild.queue.push(this.mockYoutubeVideo())
    }
    return guild;
}


module.exports.mockYoutubeVideo = (id) => {
    return {
        id: id ? id : this.generateRandomNumberString(5),
        type: 'YoutubeVideo',
        playLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: "You'll only find out by clicking the link",
        duration: 999,
        thumbnail: JSON.parse(fs.readFileSync('config.json')).SERVICE_LOGO_LINKS.youtube,
        author: this.generateRandomNumberString(18),
        failedTimes: 0
    }
}

module.exports.mockSoundcloudTrack = (id) => {
    return {
        id: id ? id : this.generateRandomNumberString(5),
        type: 'Soundcloud',
        playLink: 'https://soundcloud.com/jahseh-onfroy/bad-vibes-forever-feat-pnb-rock-trippie-redd',
        title: 'bad vibes forever...',
        duration: 150,
        thumbnail: JSON.parse(fs.readFileSync('config.json')).SERVICE_LOGO_LINKS.soundcloud,
        author: this.generateRandomNumberString(18),
        failedTimes: 0
    }
}