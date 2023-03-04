const { extractAudio } = require("./audioExtractor");
const { sleep } = require("./helpers");
const Extractor = require("./models/Extractor");

const main = async () => {
	// eslint-disable-next-line no-constant-condition
	// while (true) {
	try {
		console.log("Worker polling...");
		const result = await Extractor.get_rows_by_status();
		console.log(`Processing ${(result || []).length} tasks`);
		await Promise.all((result || []).map((item) => extractAudio(JSON.parse(item.args).link, item.unique_id)));
	} catch (err) {
		console.log("Failed to starter worker...", err);
	} finally {
		console.log("All tasks completed...");
		console.log("worker sleeping for 5 seconds...");
		await sleep(5000);
		// process.exit(0);
	}
	// }
};

main();