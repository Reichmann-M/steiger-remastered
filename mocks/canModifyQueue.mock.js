const fs = require('fs')

const generateRandomNumberString = (length) => {
    let number = '';
    for (let i = 0; i < length; i++) {
        number += Math.floor(Math.random() * 10).toString();
    }
    return number;
}

// TODO: replace fileread with mockdata in this file
const messageRaw  = {
    client: {
        reply_messages: JSON.parse(fs.readFileSync('reply_messages.json'))
    },
    guild: {
        me: {
            voice: {
                channel: undefined
            }
        },
        usedTextChannel: {
            send: function(replyMessage) {console.log(`Sending mock reply to used botchannel: ${replyMessage}`)}
        }
    },
    member: {
        voice: {
            channel: undefined
        }
    },
    reply: function(replyMessage) {console.log(`Sending mock reply message: ${replyMessage}`)}
}

const memberRaw  = {
    id: generateRandomNumberString(18),
    voice: {
        channel: undefined
    }
}


module.exports.mockUserNotInVoiceChannel = () => {
    const message = messageRaw;
    const member = memberRaw;
    message.member.voice.channel = null;
    member.voice.channel = null;
    return [message, member];
}

module.exports.mockUserNotInSameVoiceChannel = () => {
    const message = messageRaw;
    const member = memberRaw;
    const memberVoiceChannelID = '6549387435047263894';
    message.member.voice.channel = memberVoiceChannelID;
    message.guild.me.voice.channel = '1105840092242784266';
    member.voice.channel = memberVoiceChannelID;
    return [message, member];
}

module.exports.mockUserInSameVoiceChannel = () => {
    const message = messageRaw;
    const member = memberRaw;
    const randomVoiceChannelID = generateRandomNumberString(19)
    message.member.voice.channel = randomVoiceChannelID;
    message.guild.me.voice.channel = randomVoiceChannelID;
    member.voice.channel = randomVoiceChannelID;
    return [message, member];
}