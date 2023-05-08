const { PROGRESSIVE_STATUS, CONTENT_TYPES } = require("../helpers/constants");
const db = require("../database/index");

const tableName = "contents";
const attributes = {
	id: {
		type: "string",
		columnName: "id",
		primary: true
	},
	content: {
		type: "jsonb"
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
		type: "jsonb"
	},
	userId: { type: "string", references: "users.id" },
	isPrivate: {
		type: "boolean",
		columnName: "is_private"
	}
};

module.exports = {
	attributes,
	async update(id, data) {
		return db(tableName).where({ id }).update(data);
	},
	async get_rows_by_status(status = PROGRESSIVE_STATUS.QUEUED, content_type = CONTENT_TYPES.EXTRACT_AUDIO) {
		const query = db.select("id", "content", "args", "status", "content_type")
			.from(tableName)
			.where({ status, content_type });

		return query;
	},
	async updateArgsConcatJsonb(id, args) {
		return db(tableName).where({ id }).update({
			args: db.raw("args || ?::jsonb", [JSON.stringify(args)])
		});
	}
};
