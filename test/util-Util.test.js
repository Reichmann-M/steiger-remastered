const expect = require('chai').expect;

const util = require('../util/Util.js')

describe('Util.js Test of environment config', () => {
    const ownerID_regex = /[0-9]{18}/;
    const token_regex = /[0-9A-Za-z._]+/;
    const prefix_regex = /([^A-Za-z0-9]\s)+[^A-Za-z0-9]/;
    const color_regex = /(#[0-9a-fA-F]{6}\s)+#[0-9a-fA-F]{6}/;

    it('should provide a properly formatted Bot Owner ID', () => {
        const ownerID = util.OWNERID;
        expect(ownerID_regex.test(ownerID)).to.be.true;
    })
    it('should provide a properly formatted Discord API Token', () => {
        const token = util.TOKEN;
        expect(token_regex.test(token)).to.be.true;
    })
    it('should provide properly formatted Command prefixes', () => {
        const prefixes = util.PREFIX;
        expect(prefix_regex.test(prefixes)).to.be.true;
    })
    it('should provide properly formatted Bot Colors', () => {
        const color = util.COLOR;
        expect(color_regex.test(color)).to.be.true;
    })
})