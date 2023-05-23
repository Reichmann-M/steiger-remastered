var Promise = require("bluebird");
var randomNumber = require("random-number-csprng");

module.exports.send = async (client, channel) => {
    try {
        const animatedEmojisIDs = ['bot_wave0', 'bot_wave1', 'bot_wave2', 'bot_wave3', 'bot_wave4', 'bot_wave5']
        const randEmojiNum = await randomNumber(0, animatedEmojisIDs.length-1);

        
        const guildEmojis = client.emojis.cache

        let customEmoji = null;
        guildEmojis.forEach(emoji => {
            if (emoji.name == animatedEmojisIDs[randEmojiNum]) {
                customEmoji = emoji;
            }
        });

        await channel.send(`<a:${customEmoji.name}:${customEmoji.id}>`)
    } catch (error) {
        console.log(error)
        console.log('[🎩🚨] Couldn\'t send custom animated leaving emojis')
        await channel.send('👋')
    }
}