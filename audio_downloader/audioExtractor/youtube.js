
var YoutubeMp3Downloader = require("youtube-mp3-downloader");
const { getYtID } = require("../helpers");
const path = require("path");
const Extractor = require("../models/Extractor");
const { PROGRESSIVE_STATUS, CONTENT_TYPES } = require("../helpers/constants");

//Configure YoutubeMp3Downloader with your settings
var YD = new YoutubeMp3Downloader({
	"outputPath": `${path.join(process.cwd(), "../downloads")}`,    // Output file location (default: the home directory)
	"youtubeVideoQuality": "lowestaudio",  // Desired video quality (default: highestaudio)
	"queueParallelism": 2,                  // Download parallelism (default: 1)
	"progressTimeout": 1000,                // Interval in ms for the progress reports (default: 1000)
	"allowWebm": false                      // Enable download from WebM sources (default: false)
});

module.exports = {
	/**
     * Download audio from yt link
     * @param {string} link 
     * @param {string} unique_id
     */
	async downloadFromLink(link, unique_id) {
		try {
			const id = getYtID(link);
			if (!id) {
				console.log("YT ID not found for link: ", link);
				return;
			}

			Extractor.update(unique_id, {
				status: PROGRESSIVE_STATUS.INPROGRESS,
			});

			//Download video and save as MP3 file
			YD.download(id);
    
			YD.on("finished", function(err, data) {
				console.log("Download completed: ", data);
				Extractor.update(unique_id, {
					args: JSON.stringify({ path: data.file }),
					content_type: CONTENT_TYPES.EXTRACT_TRANSCRIPT
				});
			});
    
			YD.on("error", function(error) {
				Extractor.update(unique_id, {
					status: PROGRESSIVE_STATUS.QUEUED
				});
				throw error;
			});
    
			YD.on("progress", function(progress) {
				console.log("download progress...", {
					percentage: progress.progress.percentage
				});
			});
		} catch (err) {
			console.error("Unable to download YT audio");
		}
	}
};