const {
    MessageEmbed
} = require('discord.js');
const radionet_streamurl = require('../include/radionet-streamurl/main')
const RadioStationLinkJS = require('../musicHandler/RadioNetLink')
const util = require('util')
module.exports = {
    name: "radiosearch",
    aliases: ['rs'],
    cooldown: 10,
    description: "Suche nach einer Station auf Radio.net",
    async execute(message, searchTerm) {
        var searchResults = await radionet_streamurl.getSearchResults(searchTerm)

        // Filter out every station with name == undefined
        searchResults = searchResults.filter(function (obj) {
            return obj.name !== undefined;
        });

        if (searchResults.length == 0) {
            return message.reply('No radio stations found')
        }

        if (searchResults.length > 0) {
            // searchResults = searchResults.splice(10, searchResults.length-(searchResults.length-10))
            searchResults = searchResults.splice(0, 10)
        }
        var radioSearchEmbed = new MessageEmbed({
            color: message.client.color,
            title: `Radio.net Suchergebnisse für \"${searchTerm}\"`,
            thumbnail: {
                url: message.client.SERVICE_LOGO_LINKS.radionet
            },
            footer: {
                text: `Drücke in den nächsten 30 Sekunden eine Zahl, um den Sender zur Warteschlange hinzuzufügen.`
            }
        })
        var numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        var i = 0;

        searchResults.forEach(station => {
            radioSearchEmbed.addField(`${numberEmojis[i]} ${station.name}`,
                `${station.tags} | ${station.region}`)
            i++;
        });

        const radioResultMessage = await message.channel.send(radioSearchEmbed)
        for (let j = 0; j < searchResults.length; j++) {
            await radioResultMessage.react(numberEmojis[j]);
        }

        const filter = (reaction, user) => user.id !== message.client.user.id;
        const collector = radioResultMessage.createReactionCollector(filter, {
            time: 30000
        });

        collector.on("collect", async (r, user) => {
            switch (r.emoji.name) {
                case '1️⃣':
                    await RadioStationLinkJS.handle(message, searchResults[0].url)
                    break;
                case '2️⃣':
                    if (searchResults.length > 1) {
                        await RadioStationLinkJS.handle(message, searchResults[1].url)
                    }
                    break;
                case '3️⃣':
                    if (searchResults.length > 2) {
                        await RadioStationLinkJS.handle(message, searchResults[2].url)
                    }
                    break;
                case '4️⃣':
                    if (searchResults.length > 3) {
                        await RadioStationLinkJS.handle(message, searchResults[3].url)
                    }
                    break;
                case '5️⃣':
                    if (searchResults.length > 4) {
                        await RadioStationLinkJS.handle(message, searchResults[4].url)
                    }
                    break;
                case '6️⃣':
                    if (searchResults.length > 5) {
                        await RadioStationLinkJS.handle(message, searchResults[5].url)
                    }
                    break;
                case '7️⃣':
                    if (searchResults.length > 6) {
                        await RadioStationLinkJS.handle(message, searchResults[6].url)
                    }
                    break;
                case '8️⃣':
                    if (searchResults.length > 7) {
                        await RadioStationLinkJS.handle(message, searchResults[7].url)
                    }
                    break;
                case '9️⃣':
                    if (searchResults.length > 8) {
                        await RadioStationLinkJS.handle(message, searchResults[8].url)
                    }
                    break;
                case '🔟':
                    if (searchResults.length > 9) {
                        await RadioStationLinkJS.handle(message, searchResults[9].url)
                    }
                    break;
            }
            r.users.remove(user).catch(console.error)
        })
        collector.on("end", () => {
            radioResultMessage.delete().catch(console.error)
        })

    }
}