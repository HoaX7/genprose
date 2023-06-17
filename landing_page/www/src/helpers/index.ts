export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "2-digit",
	month: "short",
	day: "numeric",
};
export const toLocaleDate = (data: string | number) => new Date(data).toLocaleDateString(
	"en-us",
	DATE_OPTIONS
);

export const epochToLocaleDate = (utcSeconds: number) => {
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    return d.setUTCSeconds(utcSeconds);
}