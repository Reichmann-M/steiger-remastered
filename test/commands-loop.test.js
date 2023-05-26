const loop = require('../commands/loop.js')
const loopMock = require('../mocks/loop.mock.js')

const expect = require('chai').expect;

describe('loop.js Test of command functionality', () => {

    it('should loop the current track of the corresponding guild queue if track is playing', () => {
        const message = loopMock.mockMessageWithPlaying();
        loop.execute(message, false)
        expect(message.guild.isLooped).to.be.true;
    })
    it('should un-loop the current track of the corresponding guild queue if track is playing', () => {
        const message = loopMock.mockMessageWithPlayingAndLooped();
        loop.execute(message, false)
        expect(message.guild.isLooped).to.be.false;
    })
    it('should NOT loop because user is not in same voice channel', () => {
        const message = loopMock.mockMessageWithUserNotInSameVoiceChannel();
        loop.execute(message, false)
        expect(message.guild.isLooped).to.be.false;
    })
    it('should NOT loop because the bot is not playing at the moment', () => {
        const message = loopMock.mockMessageWithNotPlaying();
        loop.execute(message, false)
        expect(message.guild.isLooped).to.be.false;
    })
    
})