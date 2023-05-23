# steiger-remastered 🎧 Discord Music Bot
originally made for Gentleman's Club Guild and now open source for everyone

- Music bot for YouTube, Spotify, Soundcloud, Radio.net, Twitch, Vimeo
- Bot works completely without any API tokens at all
- No DMCA restrictions


## Production usage
1. Create a ```.env``` file in the root directory with following content:
```
OWNERID='328213965299515393'
TOKEN='<DISCORD-BOT-TOKEN>'
PREFIX='. , ? _ +'
COLOR='#ffde5c #ff4747 #212121 #fff8db #b8f1ff'
SERVICE_LOGO_LINKS={"radionet": "https://imgur.com/R1coQzq.png", "spotify": "https://imgur.com/ikLc5vN.png", "twitch": "https://imgur.com/kBrcLb0.png", "webstreams": "https://imgur.com/q7oCm92.png", "youtube": "https://imgur.com/UUi1aea.png", "vimeo": "https://i.imgur.com/DqdCVcj.png", "soundcloud": "https://i.imgur.com/6PpJgCX.png"}
```

Just replace ```<DISCORD-BOT-TOKEN>``` with your token (retrievable [here](https://discord.com/developers/applications)).

### Multiple instances

If you want to host multiple instances of the same bot (for instance to use more than one bot on a server):
Paste your different tokens one after another seperated with space in the ```TOKEN``` field:
```TOKEN='<FIRST-DISCORD-BOT-TOKEN> <SECOND-DISCORD-BOT-TOKEN> <THIRD-DISCORD-BOT-TOKEN> ...'```
Use a process manager like [PM2](https://pm2.keymetrics.io/) and let an environment variable ```number``` be incremented.

2. ```npm install```
3. ```npm run test```
