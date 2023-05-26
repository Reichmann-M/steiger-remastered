const resume = require('../commands/resume.js')
const resumeMock = require('../mocks/resume.mock.js')

const expect = require('chai').expect;

describe('resume.js Test of command functionality', () => {

    it('should resume the current track of the corresponding guild queue if track is paused', () => {
        const message = resumeMock.mockMessageWithPaused();
        resume.execute(message, false)
        expect(message.guild.nowPlaying).to.be.true;
        expect(message.guild.dispatcher.paused).to.be.false;
        expect(message.guild.me.nickname).to.include('🔊')
    })
    it('should NOT resume because user is not in same voice channel', () => {
        const message = resumeMock.mockMessageWithUserNotInSameVoiceChannel();
        resume.execute(message, false)
        expect(message.guild.nowPlaying).to.be.false;
        expect(message.guild.dispatcher.paused).to.be.true;
    })
    it('should NOT resume because the bot is already playing at the moment', () => {
        const message = resumeMock.mockMessageWithAlreadyPlaying();
        resume.execute(message, false)
        expect(message.guild.nowPlaying).to.be.true;
        expect(message.guild.dispatcher.paused).to.be.false;
    })
})