const ytdl = require("ytdl-core");
const InvalidUrlError = require("../errors/invalidUrl");
const UnknownError = require("../errors/unknown");
const fs = require("fs");
const { makeDir } = require("../../helpers");

module.exports = {
	/**
     * Video details includes video length, title etc
     * read more at https://github.com/fent/node-ytdl-core
     * @param {string} url 
     * @returns {Promise<ytdl.VideoDetails>}
     */
	async fetchYTVideoInfo(url) {
		try {
			console.log("Fetch YT video details for url: ", url);
			const isUrlValid = ytdl.validateURL(url);
			if (!isUrlValid) {
				throw new InvalidUrlError("Invalid YouTube URL");
			}
			console.time("url");
			const videoInfo = await ytdl.getInfo(url);
			console.timeEnd("url");
			await this._download(videoInfo);
			return "ok";
			// return videoInfo.player_response.videoDetails;
		} catch (err) {
			console.error("v2.youtube.fetchYTVideoInfo: Failed", err);
			throw new UnknownError("Unable to validate YT url");
		}
	},
	downloadFromVideoInfo(info) {
		console.log("downloading YT audio from videoinfo");
		return this._download(info);
	},
	downloadFromUrl(url) {
		const isUrlValid = ytdl.validateURL(url);
		if (!isUrlValid) {
			throw new InvalidUrlError("Invalid YouTube URL");
		}
	},
	/**
     * Read docs for more filter info
     * read more at https://github.com/fent/node-ytdl-core 
     * @param {ytdl.videoInfo | string} data 
     */
	async _download(data) {
		try {
			let stream;
			console.time("download");
			const filters = {
				quality: "lowestaudio",
				filter: "audioonly",
			};
			if (typeof data === "string") {
				stream = ytdl(data);
			} else {
				stream = ytdl.downloadFromInfo(data);
			}
			const filename = "audio";
			const dir = "../downloads";
			const isDirValid = await makeDir(dir);
			if (!isDirValid) return;
			const filepath = `${dir}/${filename}.mp3`;

			stream.pipe(fs.createWriteStream(filepath));

			stream.on("data", (chunk) => {
				console.log("Downloading chunk: ", chunk);
			});

			stream.on("error", (err) => {
				console.log("Failed to download YT audio: ", err);
			});

			stream.on("end", () => {
				console.log("download complete");
				console.timeEnd("download");
			});
			return;
		} catch (err) {
			console.error("v2.youtube._download: Failed", err);
			throw new UnknownError("Unable to download YouTube audio");
		}
	}
};
