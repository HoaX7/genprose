import { STATE_NAME } from "helpers/constants";
import initialState from "./initialState";
import { localstore, sessionstore } from "./Store";

export default class StateManager {
	public store;
	public persist;
	constructor(store = "local", persist = false) {
		this.persist = persist;
		if (store === "session") {
			this.store = sessionstore;
		} else {
			this.store = localstore;
		}
	}
	private _flush() {
		return this.store?.flush();
	}
	public getState<T>() {
		return this.store?.get<T>(STATE_NAME);
	}
	public setState<T>(value: T) {
		return this.store?.set(STATE_NAME, value);
	}
	public reset() {
		return this.store?.set(STATE_NAME, initialState);
	}
}