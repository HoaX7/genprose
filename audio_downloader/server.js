const express = require("express");
const bodyParser = require("body-parser");
const AudioExtractorsController = require("./controller/AudioExtractorsController");

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
	res.setHeader("content-type", "application/json");
	console.log(`[${req.method}] ${req.url} ${req.ip} ${res.statusCode}`);
	next();
});
app.get("/", (req, res)  => {
	return res.send({
		status: 200,
		message: "Audio Extractor Service",
		success: true
	});
});

app.get("/audioExtractor/getInfo", AudioExtractorsController.getVideoInfo);

app.listen(3000, () => {
	console.log("listening to port 3000");
});
