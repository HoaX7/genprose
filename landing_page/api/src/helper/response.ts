import { json, error } from "itty-router-extras";
export function jsonSuccess(data: unknown, options: ResponseInit = { status: 200 }) {
	const status = options.status || 200;
	const success = status && status > 199 && status <= 202;
	return json({ success, data }, options);
}

export function jsonError(data: unknown, options: ResponseInit = { status: 400 }) {
	const status = options.status || 400;
	return error(status, { success: false, data });
}
