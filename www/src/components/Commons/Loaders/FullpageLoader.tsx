import clsx from "clsx";
import React from "react";
import styles from "./Loaders.module.css";

type P = {
    title?: string;
    description?: string;
}
export default function FullpageLoader({ title = "Loading...", description }: P) {
	return (
		<div
			className={clsx(
				"fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden",
				"bg-gray-700 opacity-75 flex flex-col items-center justify-center",
			)}
		>
			<div
				className={clsx(
					"ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4",
					styles["fullpage-loader"],
				)}
			></div>
			<h2 className="text-center text-white text-xl font-semibold">
				{title}
			</h2>
			{description && <p className="w-1/3 text-center text-white">
				{description}
			</p>}
		</div>
	);
}
