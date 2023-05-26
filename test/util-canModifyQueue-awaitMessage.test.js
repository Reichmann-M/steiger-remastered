const expect = require('chai').expect;
const canModifyQueueMock = require('../mocks/canModifyQueue.mock.js')

const canModifyQueue = require('../util/canModifyQueue.js')

describe('canModifyQueue.js Test of awaitMessage()', () => {
    it('the user is not in a voice channel and therefore it should return false', () => {
        const [message] = canModifyQueueMock.mockUserNotInVoiceChannel();
        expect(canModifyQueue.awaitMessage(message)).to.be.false;
    })
    it('the user is not in the same voice channel and therefore it should return false', () => {
        const [message] = canModifyQueueMock.mockUserNotInSameVoiceChannel();
        expect(canModifyQueue.awaitMessage(message)).to.be.false;
    })
    it('the user is in the same voice channel and therefore it should return true', () => {
        const [message] = canModifyQueueMock.mockUserInSameVoiceChannel();
        expect(canModifyQueue.awaitMessage(message)).to.be.true;
    })
})