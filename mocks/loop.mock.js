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

module.exports.mockMessageWithPlaying = () => {
    const message = justclone(messageRaw)
    message.author.id = this.generateRandomNumberString(18);
    message.guild.queue = Array(this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo())
    message.guild.isLooped = false;
    message.guild.nowPlaying = true;
    message.guild.dispatcher.paused = false;
    const randomVoiceChannelID = this.generateRandomNumberString(19)
    message.guild.me.voice.channel = randomVoiceChannelID;
    message.member.voice.channel = randomVoiceChannelID;
    return message;
}

module.exports.mockMessageWithPlayingAndLooped = () => {
    const message = justclone(messageRaw)
    message.author.id = this.generateRandomNumberString(18);
    message.guild.queue = Array(this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo())
    message.guild.isLooped = true;
    message.guild.nowPlaying = true;
    message.guild.dispatcher.paused = false;
    const randomVoiceChannelID = this.generateRandomNumberString(19)
    message.guild.me.voice.channel = randomVoiceChannelID;
    message.member.voice.channel = randomVoiceChannelID;
    return message;
}

module.exports.mockMessageWithUserNotInSameVoiceChannel = () => {
    const message = justclone(messageRaw)
    message.author.id = this.generateRandomNumberString(18);
    message.guild.queue = Array(this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo(), this.mockYoutubeVideo())
    message.guild.isLooped = false;
    message.guild.nowPlaying = true;
    message.guild.dispatcher.paused = false;
    message.guild.me.voice.channel = '6549387435047263894';
    message.member.voice.channel = '1105840092242784266';
    return message;
}

module.exports.mockMessageWithNotPlaying = () => {
    const message = justclone(messageRaw)
    message.author.id = this.generateRandomNumberString(18);
    message.guild.queue = []
    message.guild.nowPlaying = false;
    message.guild.dispatcher.paused = null;
    const randomVoiceChannelID = this.generateRandomNumberString(19)
    message.guild.me.voice.channel = randomVoiceChannelID;
    message.member.voice.channel = randomVoiceChannelID;
    return message;
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