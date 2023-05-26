const debug = require('../commands/debug.js')
const debugMock = require('../mocks/debug.mock.js')

const expect = require('chai').expect;

describe('debug.js Test of command functionality', () => {
    it('should provide bot debug information if message author is bot owner', () => {
        const message = debugMock.mockMessageByBotOwner();
        expect(debug.execute(message)).to.be.true;
    })
    it('should NOT provide bot debug information if message author is NOT bot owner', () => {
        const message = debugMock.mockMessageByNotOwner();
        expect(debug.execute(message)).to.be.false;
    })
})