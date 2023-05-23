module.exports = {
    name: "ping",
    aliases: ['pingtest'],
    cooldown: 10,
    description: "Teste den durchschnittlichen Ping vom Bot",
    execute(message) {
        message.reply(`Durchschnittlicher Ping zur API: ${Math.round(message.client.ws.ping)} ms`).catch(console.error)
    }
}