import "../../public/styles/globals.css";
import React, { Fragment } from "react";
import App, { AppInitialProps } from "next/app";
import Login from "../components/Mainlayout/Login";
import MainLayout from "../components/Mainlayout/MainLayout";

type T = { isLoggedIn: boolean; }
export default class TheContentMachine extends App<T> {
	static async getInitialProps({
		Component,
		ctx,
	}: any): Promise<AppInitialProps & T> {
		let pageProps = {};
		if (Component.getInitialProps) {
			pageProps = await Component.getInitialProps(ctx);
		}
		let isLoggedIn = false;
		if (ctx.req?.cookies?.token) {
			isLoggedIn = true;
		}
		return {
			pageProps,
			isLoggedIn 
		};
	}
	render() {
		const { pageProps, Component, isLoggedIn } = this.props;
		return (
			<Fragment>
				{isLoggedIn ? <MainLayout isLoggedIn={isLoggedIn} >
					<Component {...pageProps} isLoggedIn={isLoggedIn} />
				</MainLayout> : <Login />}
				<div id="modal-root" />
			</Fragment>
		);
	}
}

