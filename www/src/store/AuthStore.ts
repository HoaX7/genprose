import { ProfileProps } from "@customTypes/Profile";
import UserData from "./UserData";

const _getIsLoggedIn = () => {
	try {
		return UserData._isLoggedIn();
	} catch (err) {
		console.error("AuthStore._getIsLoggedIn(): ", err);
		return false;
	}
};

const _setProfile = (data: ProfileProps) => {
	try {
		return UserData._setData(data);
	} catch (err) {
		console.error("AuthStore._setProfile(): ", err);
		return;
	}
};

const _getProfile = (): ProfileProps | undefined => {
	try {
		return UserData._getData();
	} catch (err) {
		console.error("AuthStore._getProfile(): ", err);
		return undefined;
	}
};

const _clear = () => {
	try {
		return UserData._remove();
	} catch (err) {
		console.error("AuthStore._clear(): ", err);
		return;
	}
};

const Auth = {
	isLoggedIn: () => _getIsLoggedIn(),
	getProfile: () => _getProfile(),
	clear: () => _clear(),
	setProfile: (data: ProfileProps) => _setProfile(data),
};

export default Auth;