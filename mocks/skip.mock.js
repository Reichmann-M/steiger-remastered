const fs = require('fs')
module.exports.generateRandomNumberString = (length) => {
    let number = '';
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }
    return number;
}

const messageRaw = {
    author: {
        id: undefined
    },
    guild: {
        nowPlaying: undefined,
        isLooped: undefined,
        loopCount: undefined,
        me: {
            nickname: 'Guild-specific Bot Username',
            setNickname(name) {this.nickname = name},
            voice: {
                channel: undefined,
            }
        },
        dispatcher: {
            paused: undefined,
            resume() {this.paused = false},
            pause() {this.paused = true},
            end() {console.log(`Resetting Guild Dispatcher`)}
        },
        queue: [],
    },
    member: {
        voice: {
            channel: undefined,
        }
    },
    client: {
        ownerID: undefined,
        user: {
            username: 'Bot Username',
        },
        guilds: {
            cache: {
                size: 5
            }
        },
        voice: {
            connections: {
                size: 3
            }
        },
        reply_messages: JSON.parse(fs.readFileSync('reply_messages.json'))
    },
    reply: function (replyMessage) { console.log(`Sending mock reply message: ${replyMessage}`) },
    react: function (reactMessage) { console.log(`Sending mock react message: ${reactMessage}`) }
}

module.exports.mockMessageWithFilledQueue = (queueSize = 4) => {
    const message = JSON.parse(JSON.stringify(message))
    message.author.id = this.generateRandomNumberString(18);
    for (let i = 0; i < queueSize; i++) {
        message.guild.queue.push(this.mockYoutubeVideo())
    }
    message.guild.isLooped = true;
    message.guild.loopCount = 2;
    message.guild.nowPlaying = true;
    message.guild.dispatcher.paused = false;
    const randomVoiceChannelID = this.generateRandomNumberString(19)
    message.guild.me.voice.channel = randomVoiceChannelID;
    message.member.voice.channel = randomVoiceChannelID;
    return message;
}

module.exports.mockMessageWithEmptyQueue = () => {
    const message = {...messageRaw}
    message.author.id = this.generateRandomNumberString(18);
    message.guild.queue = []
    message.guild.isLooped = false;
    message.guild.loopCount = undefined;
    message.guild.nowPlaying = false;
    message.guild.dispatcher.paused = undefined;
    const randomVoiceChannelID = this.generateRandomNumberString(19)
    message.guild.me.voice.channel = randomVoiceChannelID;
    message.member.voice.channel = randomVoiceChannelID;
    return message;
}

module.exports.mockYoutubeVideo = (id = this.generateRandomNumberString(5)) => {
    return {
        id: id,
        type: 'YoutubeVideo',
        playLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        title: "You'll only find out by clicking the link",
        duration: 999,
        thumbnail: JSON.parse(fs.readFileSync('config.json')).SERVICE_LOGO_LINKS.youtube,
        author: this.generateRandomNumberString(18),
        failedTimes: 0
    }
}