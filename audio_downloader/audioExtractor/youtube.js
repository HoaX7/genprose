
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
			// FIXME - How do you handle this case? This will be stuck
			// in infinite task process
			const id = getYtID(link);
			if (!id) {
				console.log("YT ID not found for link: ", link);
				return;
			}

			Extractor.update(unique_id, {
				status: PROGRESSIVE_STATUS.INPROGRESS,
			});

			const filename = new Date().getTime() + ".mp3";
			//Download video and save as MP3 file
			YD.download(id, filename);
    
			YD.on("finished", function(err, data) {
				console.log("Download completed: ", data);
				Extractor.update(unique_id, {
					args: JSON.stringify({ path: data.file, link }),
					content_type: CONTENT_TYPES.EXTRACT_TRANSCRIPT,
					status: PROGRESSIVE_STATUS.QUEUED
				});
			});
    
			YD.on("error", function(error) {
				Extractor.update(unique_id, {
					status: PROGRESSIVE_STATUS.QUEUED,
					args: JSON.stringify({ link }),
					content_type: CONTENT_TYPES.EXTRACT_AUDIO
				});
				throw error;
			});
    
			YD.on("progress", function({ progress }) {
				console.log("download progress...", {
					percentage: progress.percentage
				});
				// Extractor.update(unique_id, {
				// 	args: JSON.stringify({ progress })
				// });
			});
		} catch (err) {
			console.error("Unable to download YT audio");
			Extractor.update(unique_id, {
				status: PROGRESSIVE_STATUS.QUEUED,
				args: JSON.stringify({ link }),
				content_type: CONTENT_TYPES.EXTRACT_AUDIO
			});
		}
	}
};