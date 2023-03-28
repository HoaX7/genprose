import { ContentProps } from "../@customTypes/Ai";
import { AlertErrorMessage } from "../components/Commons/Alerts";
import { PROGRESSIVE_STATUS } from "./constants";
import { ApiResponse, requester, RequestMethodParams } from "./requester";

interface PollRequest<T, C> {
  url: string;
  data: T;
  method: RequestMethodParams;
  maxAttempts?: number;
  interval?: number;
  callback: (data: ContentProps<C>) => void;
  errorCallback: (message: string) => void;
}
export const pollRequest = <T, C>({
	interval = 10000,
	maxAttempts = 200,
	method,
	data,
	url,
	callback,
	errorCallback,
}: PollRequest<T, C>): Promise<ContentProps<C>> => {
	let attempts = 0;
	return new Promise((resolve, reject) => {
		(async function execute() {
			try {
				console.log("request to url: " + url + " started polling...");
				console.log("polling with data: ", data);
				if (attempts >= maxAttempts) throw new Error("Exceeded max attempts, Please try again");
				attempts++;
				const result: ApiResponse<ContentProps<C>> = await requester({
					data,
					url,
					method,
				});
				if (
					!result ||
        			!result.data ||
					result.data.status !== PROGRESSIVE_STATUS.COMPLETED
				) {
					setTimeout(execute, interval);
				} else {
					return resolve(result.data);
				}
			} catch (err: any) {
				AlertErrorMessage({ text: err.message || "Please try again later" });
				// // remove init data for unique_id
				// requester({
				// 	data,
				// 	method: "POST",
				// 	url: "/ai/remove_transcript",
				// });
				reject(err);
			}
		})();
	});
};
