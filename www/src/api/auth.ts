import { ProfileProps } from "@customTypes/Profile";
import { requester } from "../helpers/requester";

type P = {  secret_code: string; email: string; }
export const login = (params: P) => {
	return requester<P, ProfileProps>({
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