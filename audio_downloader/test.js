const youtube = require("./audioExtractor/v2/youtube");

// eslint-disable-next-line no-unused-vars
const boot = async () => {
	try {
		const url = "https://www.youtube.com/watch?v=s4xnyr2mCuI";
		await youtube.downloadFromUrl(url, () => {
			//
		}, (data) => {
			console.log(data);
		});
	} catch (err) {
		console.error("YouTube.test: Failed", err);
	}
};

// boot();