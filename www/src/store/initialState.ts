import { InitialAppContextProps } from "@customTypes/AppContext";
import { ProfileProps } from "@customTypes/Profile";

const initialState: InitialAppContextProps = {
	profile: {} as ProfileProps,
	isLoggedIn: false,
	globalStatus: [],
	queueMessage: "",
	metadata: {}
};

export default initialState;