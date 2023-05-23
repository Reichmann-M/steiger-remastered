// SpotifyLinkHandler

// SingleTrack-Link: https://open.spotify.com/track/6vlQYEyyuT9aF4Bc0GJFeR?si=lKP9YNXZSCuU4debdl34tA
// URI: spotify:track:6vlQYEyyuT9aF4Bc0GJFeR

// Playlist-Link: https://open.spotify.com/playlist/0vvXsWCC9xrXsKd4FyS8kM?si=IKL8vCn4QhKiVc6HTg5N8g
// URI: spotify:playlist:0vvXsWCC9xrXsKd4FyS8kM

// Album-Link: https://open.spotify.com/album/3jdqYXotnRgQwG3HTniNdH?si=lfK490QTTB2WSpK9HZcSsg
// URI: spotify:album:3jdqYXotnRgQwG3HTniNdH

// Accesstoken: https://open.spotify.com/get_access_token?reason=transport&productType=web_player

const {
    MessageEmbed
} = require('discord.js')
const SpotifyWebApi = require('spotify-web-api-node')
const spotifyApi = new SpotifyWebApi()
// const fs = require('fs')
// const util = require('util')
const MasterHandlerJS = require('./MASTERHANDLER')
const fetch = require('node-fetch')
var tempItems = []
module.exports = {
    async handle(message, spotifyLink = undefined, isPlayNext = false, isShufflePlay = false) {

        // Beta testing notification
        // message.channel.send(`Keep in mind that this new **spotify module is still in beta testing** and might malfunction. If the bot starts playing weird and not suitable songs, don't hesitate to **notify the developer** <@${message.client.ownerID}> with your **spotify song link** :)`)
        
        if (message.client.spotify.token == null) {
            await generateNewToken(message.client)
        } else {
            if (message.client.spotify.expirationTime <= Date.now()) {
                await generateNewToken(message.client)
            }
        }

        // Remove of weird stuff at the end of the link
        if (spotifyLink.includes('?si=')) {
            spotifyLink = spotifyLink.split('?si=')[0]
        }


        // Playlists
        if (spotifyLink.includes('.com/playlist/')) {
            const playlistID = spotifyLink.split('.com/playlist/')[1]

            const playlistRes = (await spotifyApi.getPlaylist(playlistID)).body
            // console.log(util.inspect(playlistInfo, {depth: null}))

            // var playlistTracksRes = (await spotifyApi.getPlaylistTracks(playlistID)).body
            // console.log(util.inspect(playlistTracksRes, {depth: null}))

            tempItems = []
            playlistRes.tracks.items.forEach(item => {
                var artists = []
                item.track.artists.forEach(artist => {
                    artists.push(artist.name)
                });
                tempItems.push({
                    type: 'SpotifyItem',
                    title: item.track.name,
                    artists: artists,
                    duration: Math.round(item.track.duration_ms / 1000),
                    author: message.author.id,
                    failedTimes: 0
                })
            });

            // More than 100 tracks in playlist
            var nextPageUrl = playlistRes.tracks.next;
            if (nextPageUrl != null) {
                var next = true;
                while (next == true) {
                    var response = null;
                    var data = null;
                    try {
                        response = await fetch(`${nextPageUrl}&access_token=${message.client.spotify.token}`)
                        data = await response.json()

                        data.items.forEach(item => {
                            var artists = []
                            item.track.artists.forEach(artist => {
                                artists.push(artist.name)
                            });
                            tempItems.push({
                                type: 'SpotifyItem',
                                title: item.track.name,
                                artists: artists,
                                duration: Math.round(item.track.duration_ms / 1000),
                                author: message.author.id,
                                failedTimes: 0
                            })
                        });

                        var nextPageUrl = data.next;
                        if (nextPageUrl == null) {
                            next = false;
                        }
                    } catch (error) {
                        next = false;
                        console.log('next page token error')
                    }
                }
            }

            await MasterHandlerJS.handlePlaylist(message.guild, tempItems, isShufflePlay)

            const titlesAddedEmbed = new MessageEmbed({
                color: message.client.color,
                description: `Playlist: [${playlistRes.name}](${playlistRes.external_urls.spotify}) von [${playlistRes.owner.display_name}](${playlistRes.owner.external_urls.spotify}) \n
                **Neu:\n${tempItems.length}** Tracks hinzugefügt`,
                image: {
                    url: playlistRes.images[0].url
                },
                thumbnail: {
                    url: message.client.SERVICE_LOGO_LINKS.spotify
                }
            })
            message.reply(titlesAddedEmbed)

            const PLAYBACK = require('../musicHandler/PLAYBACK')
            return PLAYBACK(message)

        }
        // Albums
        else if (spotifyLink.includes('.com/album/')) {

            const albumID = spotifyLink.split('.com/album/')[1]
            const albumRes = (await spotifyApi.getAlbum(albumID)).body

            tempItems = []
            albumRes.tracks.items.forEach(item => {
                var artists = []
                item.artists.forEach(artist => {
                    artists.push(artist.name)
                });
                tempItems.push({
                    type: 'SpotifyItem',
                    title: item.name,
                    artists: artists,
                    duration: Math.round(item.duration_ms / 1000),
                    author: message.author.id,
                    failedTimes: 0
                })
            });

            await MasterHandlerJS.handlePlaylist(message.guild, tempItems, isShufflePlay)

            const titlesAddedEmbed = new MessageEmbed({
                color: message.client.color,
                description: `Album: [${albumRes.name}](${albumRes.external_urls.spotify}) von [${albumRes.artists[0].name}](${albumRes.artists[0].external_urls.spotify}) \n
                **Neu:\n${tempItems.length}** Tracks hinzugefügt`,
                image: {
                    url: albumRes.images[0].url
                },
                thumbnail: {
                    url: message.client.SERVICE_LOGO_LINKS.spotify
                }
            })
            message.reply(titlesAddedEmbed)

            const PLAYBACK = require('../musicHandler/PLAYBACK')
            return PLAYBACK(message)
        }
        // Tracks
        else if (spotifyLink.includes('.com/track/')) {
            const trackID = spotifyLink.split('.com/track/')[1]

            const trackRes = (await spotifyApi.getTrack(trackID)).body

            var tempItem = {}
            var artists = []
            var artists_urls = [] // this is shit
            trackRes.artists.forEach(artist => {
                artists.push(artist.name)
                artists_urls.push(artist.external_urls.spotify)
            });
            tempItem = {
                type: 'SpotifyItem',
                title: trackRes.name,
                artists: artists,
                duration: Math.round(trackRes.duration_ms / 1000),
                author: message.author.id,
                failedTimes: 0
            }

            await MasterHandlerJS.handleSingleTrack(message.guild, tempItem, isPlayNext)

            var artist_string = ''
            for (let i = 0; i < artists.length; i++) {
                artist_string += `[${artists[i]}](${artists_urls[i]}), `          
            }
            artist_string = artist_string.substring(0,artist_string.length-2)

            const titlesAddedEmbed = new MessageEmbed({
                color: message.client.color,
                description: `[${trackRes.name}](${trackRes.external_urls.spotify}) von ${artist_string} hinzugefügt`
            })
            message.reply(titlesAddedEmbed)


            const PLAYBACK = require('../musicHandler/PLAYBACK')
            return PLAYBACK(message)
        }
        // error
        else {
            return message.reply('Falscher Spotify-Link')
        }


    }
}

async function generateNewToken(discordClient) {
    let response = await fetch("https://open.spotify.com/get_access_token?reason=transport&productType=web_player")
    let data = await response.json()
    discordClient.spotify.token = data.accessToken
    discordClient.spotify.expirationTime = data.accessTokenExpirationTimestampMs
    spotifyApi.setAccessToken(data.accessToken)
}