const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
console.log("number of cpus ", numCPUs);

if (cluster.isMaster) {
	console.log(`Master ${process.pid} is running`);
	// Fork workers.
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}
	cluster.on("exit", (worker, code, signal) => {
		//create new fork
		cluster.fork();
		console.log(`worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
	});
} else {
	require("./worker.js");
}