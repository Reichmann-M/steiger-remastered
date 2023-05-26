const expect = require('chai').expect;
const MasterHandlerMock = require('../mocks/MASTERHANDLER.mock.js')

const MasterHandler = require('../musicHandler/MASTERHANDLER.js')

describe('MASTERHANDLER.js Test of handlePlaylist()', () => {
    it('a Soundcloud playlist gets added to the queue', () => {
        const guildObject = MasterHandlerMock.mockGuildWithEmptyQueue();
        const firstPlaylistItemID = MasterHandlerMock.generateRandomNumberString(5);
        const lastPlaylistItemID = MasterHandlerMock.generateRandomNumberString(5);
        const soundcloudPlaylist = Array(MasterHandlerMock.mockSoundcloudTrack(firstPlaylistItemID), MasterHandlerMock.mockSoundcloudTrack(), MasterHandlerMock.mockSoundcloudTrack(), MasterHandlerMock.mockSoundcloudTrack(lastPlaylistItemID))

        MasterHandler.handlePlaylist(guildObject, soundcloudPlaylist, false)
        expect(guildObject.queue[0].id).to.be.equal(firstPlaylistItemID);
        expect(guildObject.queue[guildObject.queue.length-1].id).to.be.equal(lastPlaylistItemID);
    }),
    it('a Soundcloud playlist gets added to the queue as shuffleplay', () => {
        const guildObject = MasterHandlerMock.mockGuildWithEmptyQueue();
        const soundcloudPlaylist = Array(MasterHandlerMock.mockSoundcloudTrack(), MasterHandlerMock.mockSoundcloudTrack(), MasterHandlerMock.mockSoundcloudTrack(), MasterHandlerMock.mockSoundcloudTrack())

        MasterHandler.handlePlaylist(guildObject, soundcloudPlaylist, true)
        expect(guildObject.queue.length).to.be.equal(soundcloudPlaylist.length);
    })
})