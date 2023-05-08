import { ContentProps } from "../@customTypes/Ai";
import { AlertErrorMessage } from "../components/Commons/Alerts";
import { PROGRESSIVE_STATUS } from "./constants";
import { ApiResponse, requester, RequestMethodParams } from "./requester";

interface PollRequest<T> {
  url: string;
  data: T;
  method: RequestMethodParams;
  maxAttempts?: number;
  interval?: number;
  errorCallback: (message: string) => void;
  onProgress?: (data: ContentProps) => void;
}
export const pollRequest = <T>({
	interval = 10000,
	maxAttempts = 200,
	method,
	data,
	url,
	errorCallback,
	onProgress
}: PollRequest<T>): Promise<ContentProps> => {
	let attempts = 0;
	return new Promise((resolve, reject) => {
		(async function execute() {
			try {
				console.log("request to url: " + url + " started polling...");
				console.log("polling with data: ", data);
				if (attempts >= maxAttempts) throw new Error("Exceeded max attempts, Please try again");
				attempts++;
				const result: ApiResponse<ContentProps> = await requester({
					data,
					url,
					method,
				});
				if (
					!result ||
        			!result.data ||
					result.data.status !== PROGRESSIVE_STATUS.COMPLETED
				) {
					if (result.data?.status === PROGRESSIVE_STATUS.ERROR) {
						// Change this to show apporpriate error
						throw new Error("Unknown Error occured");
					}
					if (typeof onProgress === "function" && result.data) onProgress(result.data);
					setTimeout(execute, interval);
				} else {
					return resolve(result.data);
				}
			} catch (err: any) {
				AlertErrorMessage({ text: err?.message || "Please try again later" });
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
