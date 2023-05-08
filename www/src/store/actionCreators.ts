import { Metadata, StatusObject } from "@customTypes/Ai";
import { ActionDispatchProps } from "@customTypes/AppContext";
import { ProfileProps } from "@customTypes/Profile";
import actionTypes from "./actionTypes";

export const logout = () => {
	return (dispatch: ActionDispatchProps) => {
		dispatch({ type: actionTypes.LOGOUT });
	};
};

export const setProfile = (profile: ProfileProps) => {
	return (dispatch: ActionDispatchProps) => {
		dispatch({
			type: actionTypes.SET_PROFILE,
			payload: profile
		});
	}; 
};

export const setGlobalStatus = (data: StatusObject[]) => {
	return (dispatch: ActionDispatchProps) => {
		dispatch({
			type: actionTypes.SET_GLOBAL_STATUS,
			payload: data
		});
	};
};

export const setQueueMessage = (data: string) => {
	return (dispatch: ActionDispatchProps) => {
		dispatch({
			type: actionTypes.SET_QUEUE_MESSAGE,
			payload: data
		});
	};
};

export const setMetadata = (data: Metadata) => {
	return (dispatch: ActionDispatchProps) => {
		dispatch({
			type: actionTypes.SET_METADATA,
			payload: data
		});
	};
};