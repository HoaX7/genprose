const knex = require("knex");
const knexfile = require("./knexfile");

const env = "development";
const envConfig = knexfile[env];

const connection = knex(envConfig);
module.exports = connection;
