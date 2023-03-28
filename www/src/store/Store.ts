export default class Store {
	private storage;
	constructor(storage: Storage) {
		this.storage = storage;
	}
	public get<T>(key: string): T | null {
		const serializedData =  this.storage.getItem(key);
		if (serializedData) return JSON.parse(serializedData);
		return null;
	}
	public set<T>(key: string, value: T): void {
		const serializedData = JSON.stringify(value);
		return this.storage.setItem(key, serializedData);
	}
	public remove(key: string): void {
		return this.storage.removeItem(key);
	}
	public flush() {
		return this.storage.clear();
	}
}

export const localstore = typeof window !== "undefined" ? new Store(localStorage) : null;
export const sessionstore = typeof window !== "undefined" ? new Store(sessionStorage) : null;