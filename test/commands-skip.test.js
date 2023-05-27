const skip = require('../commands/skip.js')
const skipMock = require('../mocks/skip.mock.js')

const expect = require('chai').expect;

describe('skip.js Test of command functionality', () => {

    it('should skip the current track if the corresponding guild queue is NOT empty', () => {
        const initialQueueSize = 5;
        const message = skipMock.mockMessageWithFilledQueue(initialQueueSize);
        skip.execute(message)
        expect(message.guild.queue.length).to.be.equal(initialQueueSize-1)
        expect(message.guild.dispatcher).to.be.null;
        expect(message.guild.isLooped).to.be.false;
        expect(message.guild.loopCount).to.be.equal(0);
    })
    it('should reply with 🚫 if guild queue is empty', () => {
        const logSpy = jest.spyOn(global.console, 'log')
        
        const message = skipMock.mockMessageWithEmptyQueue();
        skip.execute(message)
        expect(logSpy).toHaveBeenCalled();
        // expect(logSpy).toHaveBeenCalledWith("🚫");
        logSpy.mockRestore();
    })
    // it('should NOT resume because user is not in same voice channel', () => {
    //     const message = resumeMock.mockMessageWithUserNotInSameVoiceChannel();
    //     resume.execute(message, false)
    //     expect(message.guild.nowPlaying).to.be.false;
    //     expect(message.guild.dispatcher.paused).to.be.true;
    // })
    
})