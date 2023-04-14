const ERROR_CONSTANTS = require("../../helpers/errorConstants");

class InvalidUrlError {
	constructor(message) {
		this.message = message || "Please provide a valid URL";
		this.status = 422;
		this.code = ERROR_CONSTANTS.INVALID_URL;
	}
}

module.exports = InvalidUrlError;