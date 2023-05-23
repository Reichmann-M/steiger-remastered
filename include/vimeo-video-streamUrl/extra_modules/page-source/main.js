const Request = require('request-promise')
const get_urls = require('get-urls')


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new(P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

module.exports.getPageSource = async function (url) {
    return __awaiter(this, void 0, void 0, function* () {
        const pageData = yield Request.get(url).catch(function(){
            return 'error404'
        });
        return pageData
    });
}

module.exports.extractLinks = function (html) {
    return Array.from(get_urls(html));
}