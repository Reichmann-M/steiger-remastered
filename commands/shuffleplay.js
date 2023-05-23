// Play Command !!!
const playJS = require('./play')
module.exports = {
    name: "shuffleplay",
    aliases: ['playshuffle'],
    cooldown: 3,
    description: "Spiele eine YouTube- oder Spotify-Playlist ab und mische sie direkt durch.",
    async execute(message, args) {
        const {
            channel
        } = message.member.voice

        if (!channel) return message.reply(message.client.reply_messages.warnings.playingEvent.no_voice_channel).catch(console.error)
        if (message.guild.me.voice.channel != null && channel !== message.guild.me.voice.channel) return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_voice_channel)

        if (!args.length) return message.reply(`${message.client.reply_messages.warnings.playingEvent.no_arguments.first} ${message.client.prefix}${message.client.reply_messages.warnings.playingEvent.no_arguments.second}`).catch(console.error);
        for (const arg in args) {
            if (args[arg].includes('\n')) {
                return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_play_query)
            }
        };

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_connection_permission);
        if (!permissions.has("SPEAK"))
            return message.reply(message.client.reply_messages.warnings.playingEvent.no_speaking_permission);


        if (args[0].includes('https://') && args.length > 1) return message.reply(message.client.reply_messages.warnings.playingEvent.wrong_play_query)

        playJS.execute(message,args,false,true)

    }
}