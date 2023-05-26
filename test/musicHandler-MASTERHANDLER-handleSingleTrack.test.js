const expect = require('chai').expect;
const MasterHandlerMock = require('../mocks/MASTERHANDLER.mock.js')

const MasterHandler = require('../musicHandler/MASTERHANDLER.js')

describe('MASTERHANDLER.js Test of handleSingleTrack()', () => {
    it('a YouTube video should be added to the guild queue', () => {
        const guildObject = MasterHandlerMock.mockGuildWithEmptyQueue();
        const youtubeVideo = MasterHandlerMock.mockYoutubeVideo();

        MasterHandler.handleSingleTrack(guildObject, youtubeVideo, !Math.round(Math.random()))
        expect(guildObject.queue.length).to.be.greaterThan(0);
    }),
    it('a YouTube video should be added to the guild queue and contain a valid URL', () => {
        const guildObject = MasterHandlerMock.mockGuildWithEmptyQueue();
        const youtubeVideo = MasterHandlerMock.mockYoutubeVideo();

        MasterHandler.handleSingleTrack(guildObject, youtubeVideo, !Math.round(Math.random()))
        const youtubeURL_regex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/
        expect(youtubeURL_regex.test(guildObject.queue[0].playLink)).to.be.true;
    }),
    it('a YouTube video should be added to the guild queue as playnext', () => {
        const guildObject = MasterHandlerMock.mockGuildWithFilledQueue();
        const trackItemID = MasterHandlerMock.generateRandomNumberString(5);
        const youtubeVideo = MasterHandlerMock.mockYoutubeVideo(trackItemID);

        MasterHandler.handleSingleTrack(guildObject, youtubeVideo, true)
        expect(guildObject.queue[1].id).to.be.equal(trackItemID);
    })
})