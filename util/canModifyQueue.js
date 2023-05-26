module.exports.awaitMessage = (message) => {
    const { channel } = message.member.voice

    if (!channel) {
        message.reply(message.client.reply_messages.warnings.playingEvent.no_voice_channel)
        return false;
    }
    if (message.guild.me.voice.channel != null && channel !== message.guild.me.voice.channel) { 
        message.reply(message.client.reply_messages.warnings.playingEvent.wrong_voice_channel)
        return false;
    }

    return true;
}

module.exports.awaitReaction = (member, message) => {
    const { channel } = member.voice

    if (!channel) {
        message.guild.usedTextChannel.send(`<@${member.id}>, ${message.client.reply_messages.warnings.playingEvent.no_voice_channel}`)
        return false;
    }
    if (message.guild.me.voice.channel != null && channel !== message.guild.me.voice.channel) { 
        message.guild.usedTextChannel.send(`<@${member.id}>, ${message.client.reply_messages.warnings.playingEvent.wrong_voice_channel}`)
        return false;
    }

    return true;
}