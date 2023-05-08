import { logoutApi } from "api/auth";
import axios, {
	AxiosRequestConfig,
	AxiosRequestHeaders,
	AxiosResponse,
	CancelToken,
} from "axios";
import { AlertErrorMessage } from "components/Commons/Alerts";

export type PaginationMetadata = {
    current_page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
};
export type ApiResponse<T> = {
    success?: boolean;
    error?: boolean;
    data?: T;
    metadata?: {
        pagination?: PaginationMetadata;
		expiresIn?: {
			time: number;
			unit: string;
		};
    };
};

export type RequestMethodParams = "GET" | "PUT" | "POST" | "DELETE" | "OPTIONS" | "PATCH";

type ResponseType = "RAW" | "API_RESPONSE";
export interface RequestParams<D, RT> {
    url: string;
    method: RequestMethodParams;
    data: D;
    service?: "ums" | "ams";
    version?: "v1" | "v2";
    isFile?: boolean;
    headers?: any;
    timeout?: number;
    cancelToken?: CancelToken;
    responseType?: RT;
}

const isServer = typeof window === "undefined";

type ObjectType<T, U> = T extends "RAW"
    ? AxiosResponse<ApiResponse<U>>
    : ApiResponse<U>;

const requester = async <D, T, RT extends ResponseType = "API_RESPONSE">({
	data = {} as D,
	url,
	method,
	headers = {} as AxiosRequestHeaders,
	isFile,
	timeout = 60000,
	cancelToken,
	responseType,
}: RequestParams<D, RT>): Promise<ObjectType<RT, T>> => {
	const request = {
		headers: {
			"content-type": "application/json",
			...headers,
			
		},
		timeout,
		baseURL: process.env.BACKEND_SERVICE,
		responseType: "json",
		withCredentials: true,
	} as AxiosRequestConfig;
	axios.defaults.timeout = timeout;
	const Requester = axios.create(request);

	request.url = url;
	request.method = method || "GET";
	if (method === "GET") {
		request.params = data;
	} else {
		request.data = data;
	}
	request.cancelToken = cancelToken;

	Requester.interceptors.request.use((_request) => {
		if (_request.headers?.cookie) {
			_request.headers.authorization = `Bearer ${_request.headers.cookie}`;
		}

		return _request;
	});

	// Interceptors to handle unauthorized routes
	// ('POST', 'DELETE', 'PUT', 'PATCH')
	Requester.interceptors.response.use(
		(response) => {
			if (response.headers["set-cookie"]) {
				response.headers.cookie = response.headers["set-cookie"][0];
			}
			return response;
		},
		async (err) => {
			const statusCode = err.response?.status;
			if (statusCode === 401) {
				// Logout and remove cookie
				console.log("Please re-login");
				AlertErrorMessage({ text: "Your session has expired. Please re-login." });
				if (isServer === false) {
					await logoutApi();
					window.location.href = "/";
				}
			}

			throw err;
		},
	);
	return Requester(request)
		.then((res) => (responseType === "RAW" ? res : res.data))
		.catch((err) => {
			// console.log("Error occured", err);
			if (axios.isCancel(err)) return;
			if (axios.isAxiosError(err)) {
				// console.error("Request Failed: Axios Error ", err);
				throw err.response?.data;
			} else {
				console.error("Request Failed: unexpected error occured", err);
				throw err;
			}
		});
};

export { axios as default, requester };
