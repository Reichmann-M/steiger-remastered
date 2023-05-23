const vimeoURL = require('./main.js')



async function main() {
    // const testID = await vimeoURL.getVimeoIDFromUrl('https://vimeo.com/394983720')
    const testID = await vimeoURL.getVimeoIDFromUrl('https://vimeo.com/434404225')
    console.log(await vimeoURL.getVideoSourceUrls(testID))
}


main()