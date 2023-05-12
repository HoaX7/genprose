import React, { Fragment, useEffect, useState } from "react";
import type { AppContext, AppProps } from "next/app";
// import MainLayout from "../components/Mainlayout/MainLayout";
// import Login from "../components/Mainlayout/Login";
import "../../public/styles/globals.css";
import App from "next/app";
import WithStore from "store/WithContext";
import Landing from "./landing";
// import Auth from "store/AuthStore";
// import FullpageLoader from "components/Commons/Loaders/FullpageLoader";
// import WithPageTransition from "components/Mainlayout/WithPageTransition";

// Logged in data must come from ssr props
function TheContentMachine({
	Component,
	pageProps,
	isLoggedIn = false,
}: AppProps & { isLoggedIn: boolean }) {
	// const [ _isLoggedIn, setIsLoggedIn ] = useState(false);
	// const [ loading, setLoading ] = useState(false);

	// useEffect(() => {
	// 	const loggedIn = Auth.isLoggedIn();
	// 	if (loggedIn && isLoggedIn) setIsLoggedIn(true);
	// 	setLoading(false);
	// }, []);
	return (
		<Fragment>
			<Landing />
			<div id="modal-root" />
		</Fragment>
	);
}

// {loading ? <FullpageLoader title="Loading.." /> : _isLoggedIn ? (
// 	<MainLayout isLoggedIn={isLoggedIn}>
// 		{/* <WithPageTransition {...pageProps} Component={Component} isLoggedIn={isLoggedIn} /> */}
// 		<Component {...pageProps} isLoggedIn={isLoggedIn} />
// 	</MainLayout>
// ) : (
// 	<Login />
// )}
TheContentMachine.getInitialProps = async (appContext: AppContext) => {
	const { ctx } = appContext;
	const { pageProps } = await App.getInitialProps(appContext);
	// let isLoggedIn = true;
	// const cookie = ctx.req?.headers.cookie || "";
	// if (cookie && cookie.includes("token=")) {
	// 	isLoggedIn = true;
	// }
	return {
		pageProps,
		isLoggedIn: true
	};
};

export default WithStore(TheContentMachine);
