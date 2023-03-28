import { ActionDispatchParams, InitialAppContextProps } from "@customTypes/AppContext";
import { ProfileProps } from "@customTypes/Profile";
import actionTypes from "./actionTypes";

export default (state: InitialAppContextProps, action: ActionDispatchParams<unknown>) => {
	switch (action.type) {
		case actionTypes.LOGOUT:
			state.isLoggedIn = false;
			state.profile = {} as ProfileProps;
			state.queueMessage = "";
			state.globalStatus = [];
			return state;
		case actionTypes.SET_PROFILE:
			return Object.assign({}, state, {
				profile: action.payload,
				isLoggedIn: true 
			});
		case actionTypes.SET_GLOBAL_STATUS:
			return Object.assign({}, state, { globalStatus: action.payload, });
		case actionTypes.SET_QUEUE_MESSAGE:
			return Object.assign({}, state, { queueMessage: action.payload });
		default:
			return state;
	}
};