module.exports = {
	getYtID(link = "") {
		const id = link.split("v=")[1];
		const VID_REGEX =
      /(?:youtube(?:-nocookie)?\.com\/(?:[^\\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		if (!id) {
			return link.match(VID_REGEX)[1];
		}
		return id;
	},
	sleep(delay = 2000) {
		return new Promise((resolve) => setTimeout(resolve, delay));
	},
};
