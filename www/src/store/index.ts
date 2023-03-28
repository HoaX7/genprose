import { createContext, useContext } from "react";
import { ActionDispatchProps, InitialAppContextProps } from "@customTypes/AppContext";
import StateManager from "./stateManger";

const stateManager = new StateManager();
export const storeContext = createContext<{
    state: InitialAppContextProps;
    dispatch: ActionDispatchProps;
} | null | undefined>(null);

export const initializestore = () => {
	const store = stateManager;
	store.persist = true;
	return store;
};

export const Provider = storeContext;