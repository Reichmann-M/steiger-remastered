const canModifyQueueJS = require('../util/canModifyQueue')
module.exports = {
    name: "shuffle",
    aliases: ['shuffel'],
    cooldown: 10,
    description: "Mische die derzeitige Warteschlange durch",
    async execute(message) {
        if (message.guild.queue.length == 0) {
            await message.react("🚫")
        } else {
            if (!(await canModifyQueueJS.awaitMessage(message))) {
                return;
            }
            var oFirstQueueItem = message.guild.queue[0]
            message.guild.queue.shift()
            message.guild.queue = message.guild.queue.sort(() => Math.random() - 0.5)
            message.guild.queue.unshift(oFirstQueueItem)
            await message.react("🔀")
        }
    }
}