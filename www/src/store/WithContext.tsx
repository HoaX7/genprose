import {
	ActionCreatorProps,
	ActionDispatchProps,
	InitialAppContextProps,
} from "@customTypes/AppContext";
import React, { useContext, useReducer } from "react";
import { initializestore, Provider, storeContext } from "store";
import actionReducer from "./actionReducer";
import initialState from "./initialState";

function WithStore(WrappedComponent: any) {
	withProps.getInitialProps = WrappedComponent.getInitialProps || {};
	function withProps(props: any) {
		const store = initializestore();
		const [ state, dispatch ] = useReducer(
			actionReducer,
			store.getState<InitialAppContextProps>() || initialState
		);
		store.setState(state);
		return (
			<Provider.Provider
				value={{
					state,
					dispatch,
				}}
			>
				<WrappedComponent {...props} />
			</Provider.Provider>
		);
	}

	return withProps;
}

export const connectStore = (
	cb: (
    state: InitialAppContextProps,
    dispatch: ActionDispatchProps
  ) => Partial<InitialAppContextProps & ActionCreatorProps>
) => {
	if (typeof cb !== "function") {
		throw new Error("Store callback must be a function");
	}
	return (Component: any) => {
		ComponentWithProps.getInitialProps = Component.getInitialProps;
		function ComponentWithProps(props: any = {}) {
			const ctx = useContext(storeContext);
			if (!ctx) {
				throw new Error(
					"Context must be used inside of Context Provider component"
				);
			}
			const stores = cb(ctx.state, ctx.dispatch);
			return <Component {...props} {...stores} />;
		}

		return ComponentWithProps;
	};
};

export default WithStore;