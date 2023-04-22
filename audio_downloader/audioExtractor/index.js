const { PROGRESSIVE_STATUS, CONTENT_TYPES } = require("../helpers/constants");
const Contents = require("../models/Contents");
const youtube = require("./v2/youtube");

module.exports = {
	async extractAudio(link, id) {
		try {
			console.log("audioExtractor.extractAudio: starting download for url: ", link);
			// eslint-disable-next-line no-unused-vars
			const [_, filepath] = await Promise.all([
				Contents.update(id, { status: PROGRESSIVE_STATUS.INPROGRESS }),
				youtube.downloadFromUrl(link),
			]);
			Contents.update(id, {
				status: PROGRESSIVE_STATUS.QUEUED,
				content_type: CONTENT_TYPES.EXTRACT_TRANSCRIPT,
				args: { path: filepath, link },
			});
			console.log("audioExtractor.extractAudio: download completed filepath -> ", filepath);
		} catch (err) {
			console.log("audioExtractor.extractAudio: Failed", err);
			Contents.update(id, { status: PROGRESSIVE_STATUS.ERROR });
		}
	},
};
