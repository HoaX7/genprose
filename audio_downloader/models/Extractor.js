const { PROGRESSIVE_STATUS, CONTENT_TYPES } = require("../helpers/constants");
const db = require("../database/index");

const tableName = "contents";
const attributes = {
	uniqueId: {
		type: "string",
		columnName: "unique_id",
		primary: true
	},
	content: {
		type: "blob"
	},
	contentType: {
		type: "string",
		columnName: "content_type",
		enum: CONTENT_TYPES
	},
	status: {
		type: "string",
		enum: PROGRESSIVE_STATUS
	},
	args: {
		type: "json"
	},
	email: { type: "string" }
};

module.exports = {
	attributes,
	async update(unique_id, data) {
		let params = "set ";
		const paramArray = [];
		const keys = Object.keys(data);
		keys.forEach((key, i) => {
			params = params + `${key} = ?`;
			if (i < (keys.length - 1)) params = params + ",";
			paramArray.push(data[key]);
		});
		paramArray.push(unique_id);
		const sql = `update ${tableName} ${params} where unique_id = ?`;
		console.log("[SQL] ", { sql, paramArray });
		return db.run(sql, paramArray);
	},
	async get_rows_by_status(status = PROGRESSIVE_STATUS.QUEUED) {
		const sql = "select * from contents where status = ? and content_type = ?";
		return new Promise((resolve, reject) => {
			db.all(sql, [status, CONTENT_TYPES.EXTRACT_AUDIO], (err, rows) => {
				if (err) reject(err);
				resolve(rows);
			});
		});
	}
};
