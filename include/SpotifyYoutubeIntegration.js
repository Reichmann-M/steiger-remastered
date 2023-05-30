// Spotify -> Youtube Integration Module


/*
    Purpose is to find a suitable youtube video which isn't implicitly a music video
    but rather a "youtube music" video (`${Artist} - Topic`) // (`${Artist} - Thema`)

    --> possible with (`${Songtitle} audio`)  ? BETTER: with youtube music api

    !!! exclude live videos

    if no-remix: exclude remixes+edits
*/


// Track name types:

// Normal: 
// "Get Gassed" - ["FooR", "Tyrone", "Warbz"]
// https://open.spotify.com/track/064XKlbH9yDyPz9DyL47jX?si=G04BNVqZTAC7dNOBXT5gdg



// With "- [..] Remix": 
// "Sophie - Harris & Ford Remix" - ["Anstandslos & Durchgeknallt", "Harris & Ford"]
// https://open.spotify.com/track/139hBrhHusAp5B9uDdhgf0?si=osoKFy-MS5WUqIKWXY16Rw

// With "([..] Remix)": 
// "The Flute Tune (Soulpride Remix)" - ["Jaycut", "Kolt Siewerts", "Soulpride"]
// https://open.spotify.com/track/1JO6GZPZ1sVTuIsxXSSo1w?si=GssfV_paRwCa9hv6LTa2lQ



// With "- [..] Edit": 
// "Taxi nach Paris - Thias Radio Edit" - ["The Disco Boys"]
// https://open.spotify.com/track/3w3Qh1l1Qk9ovAvDrQenyB?si=YziBCeb2Qn26n0cMZffDcA



// With "feat." || "(feat. [..])"
// "Praise The Lord (Da Shine) (feat. Skepta)" - ["A$AP Rocky", "Skepta"]
// https://open.spotify.com/track/7ycWLEP1GsNjVvcjawXz3z?si=s1yBf6HdRzCI7mH5qaxENA

// With "(with [..])"
// "I Found You (with Calvin Harris)" - ["benny blanco", "Calvin Harris"]
// https://open.spotify.com/track/5sdb5pMhcK44SSLsj1moUh?si=Qsxl91JAR6e6u0bAGw30ng


// With "- Remastered 20xx"
// "No Milk Today - Remastered 2003" - ["Herman's Hermit"]
// https://open.spotify.com/track/11aBz0SfZ23dmFu3loLU51?si=MIuWJUshQLGyC3gPvMBImA

// With "- 2016 Remaster"
// "Another Day in Paradise - 2016 Remaster" - ["Phil Collins"]
// https://open.spotify.com/track/1NCuYqMc8hKMb4cpNTcJbD?si=zmYulV3TQByA2JMo2dB2Xg

const util = require('util')
const { MessageEmbed } = require('discord.js')
const failedFetchAutoRetry = require('../util/failedFetchAutoRetry')
module.exports.handle = async (message, spotify_item) => {
    var item_construct = {}

    var title_copy = spotify_item.title

    // Artist string construction
    var sArtists = '';
    for (let i = 0; i < spotify_item.artists.length - 1; i++) {
        sArtists = sArtists + spotify_item.artists[i] + ' '
    }
    sArtists = sArtists + spotify_item.artists[spotify_item.artists.length - 1]

    // Special types like remixes
    if (title_copy.toLowerCase().includes('remix') || title_copy.toLowerCase().includes('edit') || title_copy.toLowerCase().includes('- live') || title_copy.toLowerCase().includes('nightcore')) {
        // normal youtube scraping

        var ytResults = await failedFetchAutoRetry('youtube.search-video', `${title_copy} ${sArtists}`)

        if (ytResults == null || ytResults.videos.length == 0) {
            // console.log('no remix youtube search results (1)') // remove for production

            ytResults = await failedFetchAutoRetry('youtube.search-video', `${title_copy}`)

            if (ytResults == null || ytResults.videos.length == 0) {
                // console.log('no remix youtube search results (2)') // remove for production
                console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${title_copy}|`)
                message.channel.send(new MessageEmbed({
                    color: "#e60000",
                    description: `❗ Spotifytrack **${sArtists[0]} - ${title_copy}** ergab keine Treffer`
                }))
                return message.guild.queue[0] = null
            }
            return message.guild.queue[0] = {
                type: 'YoutubeVideo',
                playLink: 'https://www.youtube.com/watch?v=' + ytResults.videos[0].id,
                title: title_copy,
                artist: spotify_item.artists[0],
                duration: ytResults.videos[0].duration,
                thumbnail: message.client.SERVICE_LOGO_LINKS.spotify,
                author: message.author.id,
                failedTimes: 0
            }
        }
        return message.guild.queue[0] = {
            type: 'YoutubeVideo',
            playLink: 'https://www.youtube.com/watch?v=' + ytResults.videos[0].id,
            title: title_copy,
            artist: spotify_item.artists[0],
            duration: ytResults.videos[0].duration,
            thumbnail: message.client.SERVICE_LOGO_LINKS.spotify,
            author: message.author.id,
            failedTimes: 0
        }
    }
    // Normal types
    else {
        // Remove unnecessary Title Extensions (like "feat.")
        title_copy = getReformattedTitle(title_copy)

        // Youtube Music API
        const music = await failedFetchAutoRetry('music', `${title_copy} ${sArtists}`)

        var found = false;
        if (music != undefined) {
            if (music.length > 0) {
                music.every(song_result => {
                    if (song_result.title == title_copy) {
                        if (song_result.artist == spotify_item.artists[0]) {
                            item_construct = {
                                type: 'YoutubeVideo',
                                playLink: 'https://www.youtube.com/watch?v=' + song_result.youtubeId,
                                title: song_result.title,
                                artist: spotify_item.artists[0],
                                duration: song_result.duration.totalSeconds,
                                thumbnail: message.client.SERVICE_LOGO_LINKS.spotify,
                                author: message.author.id,
                                failedTimes: 0
                            }
                            found = true
                            return false
                        }
                    }
                    return true;
                });
            }
        }

        if (found) {
            // console.log('found in ytmusic') // remove for production
            return message.guild.queue[0] = item_construct
        }

        // No YT Music Results -> Try: Normal Youtube Scraping

        var ytResults = await failedFetchAutoRetry('youtube.search-video', `${title_copy} ${sArtists}`)

        if (ytResults == null || ytResults.videos.length == 0) {
            // console.log('no non-remix youtube search results (1)') // remove for production
            console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${title_copy}|`)
            message.channel.send(new MessageEmbed({
                color: "#e60000",
                description: `❗ Spotifytrack **${sArtists[0]} - ${title_copy}** ergab keine Treffer`
            }))
            return message.guild.queue[0] = null
        }

        // REFACTORING: Duplicated Code -> Extract Method
        ytResults.videos.every(video => {
            if (isSpecialVersion(video)) {
                return true
            } else {
                if (video.title.toLowerCase().includes(title_copy.toLowerCase())) {
                    item_construct = {
                        type: 'YoutubeVideo',
                        playLink: 'https://www.youtube.com/watch?v=' + video.id,
                        title: title_copy,
                        artist: spotify_item.artists[0],
                        duration: video.duration,
                        thumbnail: message.client.SERVICE_LOGO_LINKS.spotify,
                        author: message.author.id,
                        failedTimes: 0
                    }
                    found = true;
                    return false;
                }
            }
            return true;
        });
        if (found) {
            return message.guild.queue[0] = item_construct;
        } else {
            // console.log('no non-remix youtube search results (2)') // remove for production
            console.log(`[🎩${message.client.bot_config_number}]❗ Unable to play track |${title_copy}|`)
            message.channel.send(new MessageEmbed({
                color: "#e60000",
                description: `❗ Spotifytrack **${sArtists} - ${title_copy}** ergab keine Treffer`
            }))
            return message.guild.queue[0] = null
        }
    }
}

//TODO: write unit test
const isSpecialVersion = (foundVideo, actualTitle) => {
    const specialVersionIdentifiers = ['live', 'nightcore', 'earrape', 'cover', 'remix', 'edit', 'slow', 'track by track'];
    let returnValue = false;
    for (let i = 0; i < specialVersionIdentifiers.length; i++) {
        if (foundVideo.title.toLowerCase().includes(specialVersionIdentifiers[i]) && !actualTitle.toLowerCase().includes(specialVersionIdentifiers[i])) {
            returnValue = true;
            break;
        };
    }
    return returnValue;
}

//TODO: write unit test
const getReformattedTitle = (title) => {
    const unwantendExtensions = [' - .+[v,V]ersion.*', ' - .+ [m,M]ix.*', ' - .+ [e,E]dition.*', ' - Bonus Track', ' \(feat\. .+\)', ' \[feat\. .+\]', ' - feat\. .+', ' \(with .+\)', ' -.*[r,R]emastere?d?.*']
    for (let i = 0; i < unwantendExtensions.length; i++) {
        if (title.match('^.+' + new RegExp(unwantendExtensions[i]).source + '$')) title = title.replace(new RegExp(unwantendExtensions[i]), '')
    }
    return title;
}