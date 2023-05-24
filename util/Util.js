require('dotenv').config()
let config;

try {
  config = require("../config.json");
} catch (error) {
  config = null;
}

exports.OWNERID = config ? config.OWNERID : process.env.OWNERID;
exports.TOKEN = config ? config.TOKEN : process.env.TOKEN.split(' ');
exports.PREFIX = config ? config.PREFIX : process.env.PREFIX.split(' ');
exports.COLOR = config ? config.COLOR : process.env.COLOR.split(' ');
exports.SERVICE_LOGO_LINKS = config ? config.SERVICE_LOGO_LINKS : JSON.parse(process.env.SERVICE_LOGO_LINKS);