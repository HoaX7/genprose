const sqlite = require("sqlite3").verbose();

const db = new sqlite.Database("../database.db");

module.exports = db;

