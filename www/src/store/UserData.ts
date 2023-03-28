import { InitialAppContextProps } from "@customTypes/AppContext";
import { ProfileProps } from "@customTypes/Profile";
import { STATE_NAME } from "helpers/constants";
import Store from "store/Store";
import initialState from "./initialState";

let store: Store;
if (typeof window !== "undefined") {
	store = new Store(localStorage);
}

const _setData = (value: ProfileProps) => {
	if (store) {
		const state = store.get<InitialAppContextProps>(STATE_NAME) || initialState;
		state.profile = value;
		state.isLoggedIn = true;
		store.set(STATE_NAME, state);
	}
	return;
};

const _getData = () => {
	if (store) {
		const state = store.get<InitialAppContextProps>(STATE_NAME) || initialState;
		return state.profile;
	}
	return;
};

const _remove = () => {
	if (store) {
		const state = store.get<InitialAppContextProps>(STATE_NAME) || initialState;
		state.profile = {} as ProfileProps;
		state.isLoggedIn = false;
		store.set(STATE_NAME, state);
	}
	return;
};

const _isLoggedIn = () => {
	if (store) {
		const state = store.get<InitialAppContextProps>(STATE_NAME) || initialState;
		return state.isLoggedIn;
	}
	return false;
};

export default {
	_setData,
	_getData,
	_remove,
	_isLoggedIn,
};