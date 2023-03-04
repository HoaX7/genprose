module.exports = {
	getYtID(link = "") {
		const id = link.split("v=")[1];
		return id;
	},
	sleep(delay = 2000) {
		return new Promise((resolve) => setTimeout(resolve, delay));
	}
};