const pagesource = require('./extra_modules/page-source/main.js')
const geturls = require('get-urls')

module.exports.getVideoSourceUrls = async function (vimeo_id) {   
    const source = await pagesource.getPageSource("https://player.vimeo.com/video/"+vimeo_id+"/config")
    if (source == 'error404') {
        return 'wrong vimeo id'
    } else {
        try {
            const json = JSON.parse(source)

            var output = {};
            output.info = {title: json.video.title, channelName: json.video.owner.name}
            output.streamMp4 = json.request.files.progressive;
            return output
        } catch (error) {
            return 'site layout changed'
        }
    }
}

module.exports.getVimeoIDFromUrl = async function (vimeo_url) {
    return vimeo_url.split(".com/")[1]
}