const youtube = require("../audioExtractor/v2/youtube");

module.exports = {
	async getVideoInfo(req, res) {
		try {
			const url = req.query.url;
			if (!url) return res.status(422).send({
				error: true,
				message: "Missing 'url' query params"
			});
			const result = await youtube.fetchYTVideoInfo(url);
			return res.status(200).send({
				data: result,
				success: true
			});
		} catch (err) {
			return res.status(err.status || 500).send({
				error: true,
				message: err.message || "Internal Server Error",
				code: err.code
			});
		}
	}
};