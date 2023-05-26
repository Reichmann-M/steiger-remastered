const pause = require('../commands/pause.js')
const pauseMock = require('../mocks/pause.mock.js')

const expect = require('chai').expect;

describe('pause.js Test of command functionality', () => {

    it('should pause the current track of the corresponding guild queue if track is playing', () => {
        const message = pauseMock.mockMessageWithPlaying();
        pause.execute(message, false)
        expect(message.guild.nowPlaying).to.be.false;
        expect(message.guild.dispatcher.paused).to.be.true;
        expect(message.guild.me.nickname).to.include('⏸️')
    })
    it('should NOT pause because user is not in same voice channel', () => {
        const message = pauseMock.mockMessageWithUserNotInSameVoiceChannel();
        pause.execute(message, false)
        expect(message.guild.nowPlaying).to.be.true;
        expect(message.guild.dispatcher.paused).to.be.false;
    })
    it('should NOT pause because the bot is not playing at the moment', () => {
        const message = pauseMock.mockMessageWithNotPlaying();
        pause.execute(message, false)
        expect(message.guild.nowPlaying).to.be.false;
        expect(message.guild.dispatcher.paused).to.be.null;
    })
})