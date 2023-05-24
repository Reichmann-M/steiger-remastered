var bot_config_number = process.env.number
if (bot_config_number == undefined) bot_config_number = 0;
const discord = require('discord.js')
const bot = new discord.Client({
  disableMentions: "everyone"
})
const {
  Player
} = require('discord-player')
const {
  TOKEN,
  PREFIX,
  COLOR,
  OWNERID,
  SERVICE_LOGO_LINKS
} = require("./util/Util");

const fs = require('fs')
const util = require('util')
require('dotenv').config()
bot.reply_messages = JSON.parse(fs.readFileSync('reply_messages.json'))

/*
    Client Setup
*/

bot.login(TOKEN[bot_config_number])
bot.bot_config_number = bot_config_number;
bot.commands = new discord.Collection();
bot.prefix = PREFIX[bot_config_number];
bot.color = COLOR[bot_config_number];
bot.ownerID = OWNERID;
bot.SERVICE_LOGO_LINKS = SERVICE_LOGO_LINKS
bot.player = new Player(bot)
bot.version = JSON.parse(fs.readFileSync('package.json')).version

const cooldowns = new discord.Collection();

/*
    Importing of Commands
*/

console.log('[🎩] Loading Commands...')
try {
  const commandFileNames = fs.readdirSync('./commands').filter(files => files.endsWith('.js'))
  for (const fileName of commandFileNames) {
    const command = require(`./commands/${fileName}`)
    bot.commands.set(command.name.toLowerCase(), command)
  }
  console.log(`[🎩${bot_config_number}]✅ Loading Commands Successful`)
} catch (error) {
  console.log(`[🎩${bot_config_number}]❗ Loading Commands resulted in error`)
  console.log(error)
}


/*
    Client Event Listeners
*/

bot.on("ready", async () => {
  console.log(`[🎩${bot_config_number}]✅ Logged in as ${bot.user.username}`)
  bot.user
    .setActivity(`${bot.prefix}help`, {
      type: "LISTENING"
    })

  if (!fs.existsSync("./cache/guilds.json")) {
    fs.writeFileSync("./cache/guilds.json", "[]")
  }

  const guildsJSON = JSON.parse(fs.readFileSync("./cache/guilds.json"))
  const releaseChangesJSON = JSON.parse(fs.readFileSync("./cache/releaseChanges.json"))
  const botOwner = await bot.users.fetch(bot.ownerID)
  bot.guilds.cache.forEach(guild => {
    resetGuildAttributes(guild)
    guild.me.setNickname("");

    try {
      let found = false;
      guildsJSON.forEach(gJson => {
        if (gJson.id === guild.id) {
          found = true;
          let foundSRC = false;
          gJson.saidReleaseChanges.forEach(sRC => {
            if (sRC == bot.version) {
              foundSRC = true;
            }
          });
          if (!foundSRC) {
            const latestReleaseChange = releaseChangesJSON[releaseChangesJSON.length - 1]
            // guild.channels.cache.get(gJson.messageChannelId).send(new discord.MessageEmbed({
            //   color: "#00ff00",
            //   author: {
            //     name: `🤖 v${latestReleaseChange.version}`
            //   },
            //   image: {
            //     url: "https://i.imgur.com/wiLXpAY.png"
            //   },
            //   thumbnail: {
            //     url: "https://i.imgur.com/Y03xU39.jpg"
            //   },
            //   title: latestReleaseChange.headline,
            //   description: latestReleaseChange.text,
            //   footer: {
            //     text: `Developer: ${botOwner.username} aka Reichmann-M (github.com/reichmann-m), v${client.version}`,
            //     icon_url: botOwner.displayAvatarURL()
            //   }
            // }).setTimestamp())
            gJson.saidReleaseChanges.push(bot.version)
          }

        }
      });
      if (!found) {
        const botTextChannel = getGuildBotChannel(guild);
        guildsJSON.push({
          id: guild.id,
          name: guild.name,
          messageChannelId: botTextChannel.id ? botTextChannel.id : guild.channels.cache[0], // Take bots channel if existing, otherwise take first textchannel
          saidReleaseChanges: []
        })
      }

      fs.writeFileSync("./cache/guilds.json", JSON.stringify(guildsJSON))

    } catch (error) {
      console.log(error)
    }


    console.log(`[🎩${bot_config_number}]✅ Bot successfully loaded guild: ${guild.name} (${guild.id})`)
  });
})
// client.on("warn", (info) => console.log(info));
// client.on("error", console.error);

bot.on("message", async (message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (message.content.substring(0, bot.prefix.length) != bot.prefix) return;
  console.log(`[🎩${bot_config_number}]➡️ User command: |${message}| by user ${message.author.username} (${message.author.id})`)
  message.content = message.content.substring(bot.prefix.length)

  message.guild.usedTextChannel = message.channel;

  const args = message.content.split(' ')
  const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName) || bot.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
  if (!command) return message.reply(bot.reply_messages.warnings.userInput.no_command);

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new discord.Collection());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 1) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      console.log(`[🎩${bot_config_number}]❗ Command |${message}| too early`)
      return message.reply(
        `${bot.reply_messages.warnings.cooldown.first} ${timeLeft.toFixed(1)} ${bot.reply_messages.warnings.cooldown.second} \`${command.name}\` ${bot.reply_messages.warnings.cooldown.third}`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  message.guild.messageChannel = message.channel;
  const guildsJSON = JSON.parse(fs.readFileSync("./cache/guilds.json"))
  guildsJSON.forEach(gJson => {
    if (gJson.id === message.guild.id) {
      gJson.messageChannelId = message.channel.id;
    }
  });
  fs.writeFileSync("./cache/guilds.json", JSON.stringify(guildsJSON))

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply(bot.reply_messages.errors.general_command_execution_error).catch(console.error);
  }
})

bot.on("guildCreate", (guild) => {
  resetGuildAttributes(guild)
  guild.me.setNickname("");

  const guildsJSON = JSON.parse(fs.readFileSync("./cache/guilds.json"))
  let found = false;
  guildsJSON.forEach(gJson => {
    if (gJson.id === guild.id) {
      found = true;
    }
  });
  if (!found) {
    const botTextChannel = getGuildBotChannel(guild);
    guildsJSON.push({
      id: guild.id,
      name: guild.name,
      messageChannelId: botTextChannel.id ? botTextChannel.id : guild.channels.cache[0], // Take bots channel if existing, otherwise take first textchannel
      saidReleaseChanges: []
    })
  }
  fs.writeFileSync("./cache/guilds.json", JSON.stringify(guildsJSON))
  console.log(`[🎩${bot_config_number}]✅ Bot successfully added to new guild: ${guild.name} (${guild.id})`)
})

bot.on("voiceStateUpdate", async (oldState, newState) => {
  // Bot itself
  if (oldState.member.id == bot.user.id) {
    // Bot has been moved
    if (oldState.channel != null && newState.channel != null && oldState.channel != newState.channel) {
      newState.guild.usedTextChannel.send(new discord.MessageEmbed({
        color: bot.color,
        description: `${bot.reply_messages.neutral.bot_moved.first} ${oldState.channel.name} ${bot.reply_messages.neutral.bot_moved.second} ${newState.channel.name} ${bot.reply_messages.neutral.bot_moved.third}`
      }))
      newState.guild.usedVoiceChannel = newState.channel;
      console.log(`[🎩${bot_config_number}]✅ Bot was moved from channel ${oldState.channel.name} to ${newState.channel.name}`)
    }
    // Bot disconnected from the channel (by user / or by itself)
    else if (oldState.channel != null && newState.channel == null) {
      try {
        await oldState.guild.playingMessage.delete()
        oldState.guild.playingMessage = null;
      } catch (error) {

      }
      if (oldState.guild.usedTextChannel != null) {
        const leavingMessageJS = require('./util/leavingMessage.js')
        await leavingMessageJS.send(bot, oldState.guild.usedTextChannel)
      }
      resetGuildAttributes(oldState.guild)
      oldState.guild.me.setNickname("");
      console.log(`[🎩${bot_config_number}]✅ Bot disconnected from voiceChannel ${oldState.channel.name}`)
    }

    // Someone tried to un-serverdeaf the bot
    else if (newState.serverDeaf == false && oldState.serverDeaf == true) {
      newState.guild.usedTextChannel.send(`❗ **Bitte lasse mich serverweit taub sein. Dies garantiert bessere Performance und mehr Privatsphäre für Euch :)**`)
      try {
        newState.guild.connection.voice.setSelfDeaf(true)
        newState.guild.connection.voice.setDeaf(true)
      } catch (error) {
        console.log(error) // remove for production
      }
    }

  } else if (oldState.channel == oldState.guild.usedVoiceChannel && oldState.channel != null) {
    // Last human user left channel
    // Bot has to disconnect
    var bStillHumans = false;
    oldState.guild.voiceStates.cache.every(voiceState => {
      if (voiceState.channel == oldState.guild.usedVoiceChannel && voiceState.member.user.bot == false) {
        bStillHumans = true;
        return false;
      }
      return true;
    });
    if (!bStillHumans) {
      if (oldState.guild.usedVoiceChannel != null) {
        oldState.guild.usedVoiceChannel.leave()
        console.log(`[🎩${bot_config_number}]✅ Bot auto-left from voiceChannel ${oldState.channel.name} because no human users left.`)
      }
    }
  }
})


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//                            HELPER FUNCTIONS
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


function getGuildBotChannel(guild) {
  const guildChannels = guild.channels.cache;
  let return_value = '';

  const textChannels = guildChannels.filter(channel => channel.type === 'text')
  return_value = textChannels.find(tChannel => tChannel.name.includes('bot'))
  if (return_value == undefined) {
    return textChannels.first()
  }
  return return_value;
}

function resetGuildAttributes(guild) {
  guild.queue = [];
  guild.nowPlaying = false;
  guild.usedVoiceChannel = null;
  guild.usedTextChannel = null;
  guild.connection = null;
  guild.isLooped = false;
  guild.loopCount = 0 // #### NEW ####
  guild.playingMessage = null;
  guild.collector = null;
  guild.volume = 100;
  bot.spotify = {
    token: null,
    expirationTime: null
  }
}