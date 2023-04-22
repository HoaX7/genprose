const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = {
	development: {
		client: "pg",
		connection: {
			host: process.env.PG_HOST,
			user: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.DB_NAME,
		},
		pool: {
			min: 1,
			max: 5
		},
	},
	onUpdateTrigger: (table) => `
  CREATE TRIGGER ${table}_updated_at
  BEFORE UPDATE ON ${table}
  FOR EACH ROW
  EXECUTE PROCEDURE on_update_timestamp();`,
};
