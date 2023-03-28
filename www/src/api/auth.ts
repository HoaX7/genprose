import { requester } from "../helpers/requester";

export const login = (params: { secret_code: string; email: string; }) => {
	return requester({
		data: params,
		method: "POST",
		url: "/login"
	});
};

export const logoutApi = () => {
	return requester({
		data: "",
		method: "POST",
		url: "/logout"
	});
};