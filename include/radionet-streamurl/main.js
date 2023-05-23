const pagesource = require('./extra_modules/page-source/main.js')
const html2json = require('html2json').html2json
const geturls = require('get-urls')
const util = require('util')
const fs = require('fs')
const he = require('he')
const rp = require('request-promise')
const $ = require('cheerio')

module.exports.getStationInfo = async function (radio_url) {
    const source = await pagesource.getPageSource(radio_url)
    if (source == 'error404') {
        return 'wrong radio station link'
    } else {
        try {
            const links = geturls(source)
            var station_logo = '';
            links.forEach(element => {
                if (element.includes('cloudfront') && station_logo == '') {
                    station_logo = element;
                }
            });
            const json = html2json(source)
            var body = {}
            for (const child in json.child[0].child) {
                if (json.child[0].child[child].tag == 'body') {
                    body = json.child[0].child[child]
                    break
                }
            }
            var div_main;
            for (const child in body.child) {
                if (body.child[child].tag == 'div' && body.child[child].attr.id == 'main') {
                    div_main = body.child[child]
                    break
                }
            }
            var div_element = div_main.child[0]
            var header;
            for (const child in div_element.child) {
                if (div_element.child[child].tag == 'header') {
                    header = div_element.child[child]
                    break
                }
            }
            var header;
            for (const child in div_element.child) {
                if (div_element.child[child].tag == 'header') {
                    header = div_element.child[child]
                    break
                }
            }
            var div_element2 = header.child[0]
            var div_53;
            for (const child in div_element2.child) {
                if (div_element2.child[child].tag == 'div' && div_element2.child[child].attr.offset == '53') {
                    div_53 = div_element2.child[child]
                    break
                }
            }
            var div_element3 = div_53.child[0]
            var div_player_inner = div_element3.child[0]
            var div_element4 = div_player_inner.child[0]
            var div_element5 = div_element4.child[0]
            var script_element = div_element5.child[0]
            var script_text = script_element.child[0].text

            var all_urls = geturls(script_text)
            var stream_urls = []
            all_urls.forEach(element => {
                if (!element.includes('mytimm') && (!element.includes('cloudfront') && (!element.includes('api.radio.de')))) {
                    stream_urls.push(element)
                }
            });
            if (stream_urls.length > 1) {
                stream_urls.pop()
            }

            // Station Name
            var station_name = ((await $('title', source)).text())
            station_name = station_name.replace(' | Live per Webradio hören','')


            var response = {
                station_name: station_name,
                station_logo: station_logo,
                stream_urls: stream_urls
            }
            return response;
        } catch (error) {
            console.log(error)
            return 'site layout changed'
        }
    }
}
module.exports.getSearchResults = async function (search_term) {

    var html = await rp('https://www.radio.de/search?q=' + search_term)

    var stations = [];

    const ll_stations = $('div[class="fnxtk-3 fmTOtT"]', html)['0'].children;

    ll_stations.forEach(currStation => {
        var currULR = ''
        // Whether Containing weird radio.de extra div inside station div -.-
        if (currStation.children[0].name == 'a') {
            var currItemNumber = 0;
        } else {
            var currItemNumber = 1;
        }

        // Station URL
        currULR = currStation.children[currItemNumber].attribs.href

        // Station Name
        const currStationName = currStation.children[currItemNumber].children[0].children[1].children[0].children[0].data


        
        // Temporary Region Genre Construct
        tempRegionGenreTagComb = ''
        currStation.children[currItemNumber].children[0].children[1].children[1].children.forEach(regionGenreTagComb => {
            if (regionGenreTagComb.type != 'comment') {
                tempRegionGenreTagComb = tempRegionGenreTagComb + regionGenreTagComb.data
            }
        });

        // Scraping Region & Genre out of Temporary Region Genre Construct
        const currRegion = tempRegionGenreTagComb.split(' / ')[0]
        const currGenre = tempRegionGenreTagComb.split(' / ')[1]

        stations.push({
            url: 'https://www.radio.de' + currULR,
            name: currStationName,
            region: currRegion,
            tags: currGenre
        })
    });

    return stations;


}