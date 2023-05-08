const ytdl = require("ytdl-core");
const InvalidUrlError = require("../errors/invalidUrl");
const UnknownError = require("../errors/unknown");
const fs = require("fs");
const { makeDir } = require("../../helpers");
const { AUDIO_DOWNLOAD_PATH } = require("../../helpers/constants");

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
			return videoInfo.player_response.videoDetails;
		} catch (err) {
			console.error("v2.youtube.fetchYTVideoInfo: Failed", err);
			throw new UnknownError("Unable to validate YT url");
		}
	},
	downloadFromVideoInfo(info, onComplete) {
		console.log("downloading YT audio from videoinfo");
		return this._download(info, onComplete);
	},
	/**
     * @param {string} url 
     * @returns 
     */
	async downloadFromUrl(url, onComplete, onInfo) {
		const isUrlValid = ytdl.validateURL(url);
		if (!isUrlValid) {
			throw new InvalidUrlError("Invalid YouTube URL");
		}
		const filepath = await this._download(url, onComplete, onInfo);
		return filepath;
	},
	/**
     * Read docs for more filter info
     * read more at https://github.com/fent/node-ytdl-core 
     * @param {ytdl.videoInfo | string} data 
     */
	async _download(data, onComplete, onInfo) {
		try {
			let stream;
			console.time("download");
			const filters = {
				filter: "audioonly",
				quality: "highestaudio"
			};
			console.log("v2.youtube._download: download started");
			if (typeof data === "string") {
				stream = ytdl(data, filters);
			} else {
				stream = ytdl.downloadFromInfo(data, filters);
			}
			const filename = new Date().getTime();
			const dir = `../${AUDIO_DOWNLOAD_PATH}`;
			const isDirValid = await makeDir(dir);
			if (!isDirValid) return;
			const filepath = `${dir}/${filename}.mp3`;

			stream.pipe(fs.createWriteStream(filepath));

			stream.on("info", (info) => {
				// read @docs https://github.com/fent/node-ytdl-core/blob/master/typings/index.d.ts#L235
				// for more info
				if (info && typeof onInfo === "function") {
					onInfo(info.videoDetails);
				}
			});

			stream.on("data", (chunk) => {
				console.log("Downloading chunk: ", chunk);
			});

			stream.on("error", (err) => {
				console.log("Failed to download YT audio: ", err);
			});

			stream.on("end", () => {
				console.log("download complete");
				if (typeof onComplete === "function") {
					onComplete();
				}
				console.timeEnd("download");
			});
			return filepath;
		} catch (err) {
			console.error("v2.youtube._download: Failed", err);
			throw new UnknownError("Unable to download YouTube audio");
		}
	}
};
