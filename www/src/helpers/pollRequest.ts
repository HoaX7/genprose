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
	maxAttempts = 50,
	method,
	data,
	url,
	callback,
	errorCallback,
}: PollRequest<T, C>) => {
	let attempts = 0;

	const execute = async () => {
		try {
			console.log("request to url: " + url + " started polling...");
			console.log("polling with data: ", data);
			// if (attempts >= maxAttempts) throw new Error("Exceeded max attempts");
			attempts++;
			const result: ApiResponse<ContentProps<C>> = await requester({
				data,
				url,
				method,
			});
			if (
				!result ||
        !result.data ||
        result.data.status === PROGRESSIVE_STATUS.INPROGRESS ||
        result.data.status === PROGRESSIVE_STATUS.QUEUED
			) {
				setTimeout(execute, interval);
			} else {
				return Promise.resolve(result.data);
			}
		} catch (err: any) {
			AlertErrorMessage({ text: err.message || "Please try again later" });
			// // remove init data for unique_id
			// requester({
			// 	data,
			// 	method: "POST",
			// 	url: "/ai/remove_transcript",
			// });
			return Promise.reject(err.message);
		}
	};

	return execute();
};
