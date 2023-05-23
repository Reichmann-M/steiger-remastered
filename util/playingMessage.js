var { MessageEmbed } = require('discord.js')
const canModifyQueueJS = require('../util/canModifyQueue')
module.exports.update = async (message) => {
    if (message.guild.queue.length > 0) {
        try {
            if (message.guild.playingMessage != null) {
                try {
                    await message.guild.playingMessage.delete()
                    message.guild.playingMessage = null;
                } catch (error) {
                    
                }
            }
        } catch (error) {
            console.log(error)
        }
        
        var playingMessageEmbed = new MessageEmbed({
            color: message.client.color,
            description: message.guild.queue[0].artist ?
             `[${message.guild.queue[0].title}](${message.guild.queue[0].playLink}) von [${message.guild.queue[0].artist}](https://www.google.com/search?&q=${encodeURIComponent(message.guild.queue[0].artist)})\n[<@${message.guild.queue[0].author}>]`
              : `[${message.guild.queue[0].title}](${message.guild.queue[0].playLink})\n[<@${message.guild.queue[0].author}>]`,
            thumbnail: {url: message.guild.queue[0].thumbnail}
        });
    
        if (!(message.guild.nowPlaying)) {
            playingMessageEmbed.setTitle(`Pausiert - Drücke ⏯`)
        } else {
            playingMessageEmbed.setTitle(`Jetzt kommt`)
        }
    
        if (message.guild.isLooped) {
            playingMessageEmbed.setFooter(message.guild.loopCount > 0 ? `🔂 Loop aktiviert [${message.guild.loopCount+1}x]` : `🔂 Loop aktiviert`)
        }
    
        message.guild.playingMessage = await message.channel.send(playingMessageEmbed);
    
        try {
            message.guild.playingMessage.react("⏯");
            message.guild.playingMessage.react("⏭");
            //message.guild.playingMessage.react("🔉");
            //message.guild.playingMessage.react("🔊");
            //message.guild.playingMessage.react("🔀");
            message.guild.playingMessage.react("🔂");
            message.guild.playingMessage.react("⏹");
        } catch (error) {
            // console.log(error) -- removed for production: spamming into console
        }
    
        const filter = (reaction, user) => user.id !== message.client.user.id;
        try {
            message.guild.collector = message.guild.playingMessage.createReactionCollector(filter, {
                time: 0
            });
            message.guild.collector.on('collect', async (r, user) => {
                const member = message.guild.members.cache.get(user.id);
                const PlayingMessageJS = require('../util/playingMessage')
                if (message.guild.queue.length > 0) {
                    console.log(`[🎩${message.client.bot_config_number}]➡️ User Reaction to playingMessage: |${r.emoji.name}| by user ${user.username} (${user.id}) to playingMessage ${message.guild.playingMessage.id} in guild ${message.guild.name} (${message.guild.id})`)
                    switch (r.emoji.name) {
                        case "⏯":
                            await r.users.remove(user).catch(console.error)
                            if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                                return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            }
                            if (message.guild.nowPlaying) {
                                message.guild.nowPlaying = false
                                message.channel.send(new MessageEmbed({
                                    color: message.client.color,
                                    description: `⏸️ Track pausiert von <@${user.id}>`
                                }))
                                message.guild.dispatcher.pause(true)
                                message.guild.me.setNickname(`⏸️ ${message.client.user.username}`);
                            } else {
                                message.guild.nowPlaying = true
                                message.channel.send(new MessageEmbed({
                                    color: message.client.color,
                                    description: `▶️ Track fortgesetzt von <@${user.id}>`
                                }))
                                message.guild.dispatcher.resume()
                                message.guild.me.setNickname(`🔊 ${message.client.user.username}`);
                            }
                            await PlayingMessageJS.update(message)
                            break;
                        case "⏭":
                            await r.users.remove(user).catch(console.error)
                            if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                                return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            }
                            message.guild.dispatcher.resume()
                            message.guild.dispatcher.end()
                            message.guild.dispatcher = null;
                            message.guild.isLooped = false;
                            message.guild.loopCount = 0
                            message.channel.send(new MessageEmbed({
                                color: message.client.color,
                                description: `👌 Track übersprungen von <@${user.id}>`
                            }))
                            break;
        
                            //     case "🔉":
                            //     r.users.remove(user).catch(console.error)
                            // if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                            //     return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            // }
                            //     if (message.guild.volume == 0) return;
                            //     if (message.guild.volume - 10 <= 0) message.guild.volume = 0;
                            //     else message.guild.volume = message.guild.volume - 10;
                            //     message.guild.dispatcher.setVolumeLogarithmic(message.guild.volume / 100)
                            //     message.channel.send(new MessageEmbed({
                            //         color: message.client.color,
                            //          fields: [{
                            //                 name: '🔉➖ Die Lautstärke wurde gemindert durch',
                            //                 value: '<@' + user.id + '>',
                            //             },
                            //             {
                            //                 name: '🔉➖ Die Lautstärke beträgt nun',
                            //                 value: message.guild.volume,
                            //             }
                            //         ]
                            //     }))
                            //     break;
                            // case "🔊":
                            //     r.users.remove(user).catch(console.error)
                            // if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                            //     return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            // }
                            //     if (message.guild.volume == 100) return;
                            //     if (message.guild.volume + 10 > 100) message.guild.volume = 100;
                            //     else message.guild.volume = message.guild.volume + 10;
                            //     message.guild.dispatcher.setVolumeLogarithmic(message.guild.volume / 100)
                            //     message.channel.send(new MessageEmbed({
                            //          color: message.client.color,
                            //         fields: [{
                            //                 name: '🔊➕ Die Lautstärke wurde erhöht durch',
                            //                 value: '<@' + user.id + '>',
                            //             },
                            //             {
                            //                 name: '🔊➕ Die Lautstärke beträgt nun',
                            //                 value: message.guild.volume,
                            //             }
                            //         ]
                            //     }))
                            //     break;
        
        
                        case "🔂":
                            await r.users.remove(user).catch(console.error)
                            if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                                return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            }
                            if (message.guild.isLooped) {
                                message.guild.isLooped = false;
                                message.channel.send(new MessageEmbed({
                                    color: message.client.color,
                                    description: `🚫🔂 Der derzeitige Track ist nun NICHT MEHR auf Loop durch <@${user.id}>`
                                }))
                            } else {
                                message.guild.isLooped = true;
                                message.channel.send(new MessageEmbed({
                                    color: message.client.color,
                                    description: `✅🔂 Der derzeitige Track ist nun auf Loop durch <@${user.id}>`
                                }))
                            }
                            await PlayingMessageJS.update(message)
                            break;
                            // case "🔀":
                            //     r.users.remove(user).catch(console.error)
                            // if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                            //     return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            // }
                            //     var oFirstQueueItem = message.guild.queue[0]
                            //     message.guild.queue.shift()
                            //     message.guild.queue = message.guild.queue.sort(() => Math.random() - 0.5)
                            //     message.guild.queue.unshift(oFirstQueueItem)
                            //     message.channel.send(new MessageEmbed({
                            //      color: message.client.color,
                            //         fields: [{
                            //             name: '🔀 Die Warteschlange wurde durchmischt von',
                            //             value: '<@' + user.id + '>',
                            //         }]
                            //     }))
                            //     break;
                        case "⏹":
                            await r.users.remove(user).catch(console.error)
                            if (!(await canModifyQueueJS.awaitReaction(member, message))) {
                                return console.log(`[🎩${message.client.bot_config_number}]❗ User ${message.author.username} (${message.author.id}) cannot modify queue!`);
                            }
                            message.guild.queue = []
                            message.guild.nowPlaying = false;
                            message.guild.isLooped = false;
                            message.guild.loopCount = 0
                            message.guild.dispatcher.destroy()
                            message.guild.dispatcher = null;
                            message.guild.me.setNickname("");
                            try {
                                await message.guild.playingMessage.delete()
                                message.guild.playingMessage = null;
                            } catch (error) {
                                
                            }
                            message.channel.send(new MessageEmbed({
                                color: message.client.color,
                                description: `⏹ Die Warteschlange wurde geleert von <@${user.id}>`
                            }))
                            break;
                        default:
                            await r.users.remove(user).catch(console.error)
                            break;
                    }
        
                }
            });
            message.guild.collector.on('end', () => message.guild.collector = null);
        } catch (error) {
            // console.log(error) -- removed for production: spamming into console
        }
        

    }    
}