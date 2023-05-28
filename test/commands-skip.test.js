const skip = require('../commands/skip.js')
const skipMock = require('../mocks/skip.mock.js')

const chai = require('chai')
const expect = require('chai').expect;
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
chai.use(sinonChai)

describe('skip.js Test of command functionality', () => {
  
    beforeEach(function() {
        sinon.spy(console, 'log');
      });
    
    afterEach(function() {
        console.log.restore();
    });
    
    it('should skip the current track if the corresponding guild queue is NOT empty', () => {
        const initialQueueSize = 5;
        const message = skipMock.mockMessageWithFilledQueue(initialQueueSize);
        skip.execute(message)
        expect(message.guild.queue.length).to.be.equal(initialQueueSize - 1)
        expect(message.guild.dispatcher).to.be.null;
        expect(message.guild.isLooped).to.be.false;
        expect(message.guild.loopCount).to.be.equal(0);
    })
    it('should NOT skip because user is not in same voice channel', () => {
        const initialQueueSize = 5;
        const message = skipMock.mockMessageWithUserNotInSameVoiceChannel(initialQueueSize);
        skip.execute(message)
        expect(message.guild.queue.length).to.be.equal(initialQueueSize)
    })
    it('should NOT skip and reply with 🚫 if guild queue is empty', () => {
        const message = skipMock.mockMessageWithEmptyQueue();
        skip.execute(message)
        expect(console.log).to.be.called;
        expect(console.log).to.have.been.calledWith(sinon.match(/.*🚫.*/))
    })
})