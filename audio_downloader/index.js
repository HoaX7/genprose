// const cluster = require("cluster");
// const numCPUs = require("os").cpus().length;
// console.log("number of cpus ", numCPUs);

// if (cluster.isMaster) {
// 	console.log(`Master ${process.pid} is running`);
// 	// Fork workers.
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	cluster.on("exit", (worker, code, signal) => {
// 		//create new fork
// 		cluster.fork();
// 		console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
// 	});
// } else {
// 	require("./worker.js");
// }

const ytdl = require("ytdl-core");
const fs = require("fs");

const boot = async () => {
	console.time("download");
	const stream = ytdl("https://www.youtube.com/watch?v=s4xnyr2mCuI", {
		filter: "audioonly",
		quality: "highestaudio"
	});
	// const stream = ytdl.downloadFromInfo(info, {
	// 	filter: "audioonly",
	// 	quality: "highestaudio"
	// });
	stream.pipe(fs.createWriteStream("./audio.mp3"));

	stream.on("data", (chunk) => {
		console.log("Streaming chunk: ", chunk);
	});

	stream.on("end", () => {
		console.log("download compete");
		console.timeEnd("download");
	});

	// stream.on("progress", (progress) => {
	//     console.log({progress})
	// })
};

boot();