import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { AppProps } from "next/app";
import clsx from "clsx";

export default function WithPageTransition({ Component, ...pageProps }: AppProps) {
	const router = useRouter();
	const [ transitioning, setTransitioning ] = useState(false);

	const prevScreen = useRef(Component);
	useEffect(() => {
		// handler will create a transition effect between route changes,
		// so that it doesn't automatically display the next screen.
		const handler = () => {
			setTransitioning(true);
			setTimeout(() => {
				prevScreen.current = Component;
				setTransitioning(false);
			}, 280);
		};
		router.events.on("routeChangeComplete", handler);
		return () => {
			router.events.off("routeChangeComplete", handler);
		};
	}, [ Component, router.events ]);

	const Screen = transitioning ? prevScreen.current : Component;
	return (
		<div className={clsx(transitioning ? "animate-slide-left-leave" : "animate-slide-left-enter")}>
			<Screen {...pageProps} />
		</div>
	);
}
