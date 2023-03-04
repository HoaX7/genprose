const youtube = require("./youtube");

module.exports = {
	async extractAudio(link, unique_id) {
		return youtube.downloadFromLink(link, unique_id);
	}
};