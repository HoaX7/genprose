const ERROR_CONSTANTS = require("../../helpers/errorConstants");

class UnknownError {
	constructor(message) {
		this.message = message || "Unknown Error occured";
		this.status = 500;
		this.code = ERROR_CONSTANTS.UNKOWN;
	}
}

module.exports = UnknownError;