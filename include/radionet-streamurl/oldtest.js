const radioHandlerJS = require('./main.js')

async function main() {
    console.log(await radioHandlerJS.getSearchResults('bbc radio 2'))
    console.log('test')
}
main()