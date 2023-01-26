import { requester } from "../helpers/requester";

export const login = (params: { secret_code: string; }) => {
	return requester({
		data: params,
		method: "POST",
		url: "/login"
	});
};