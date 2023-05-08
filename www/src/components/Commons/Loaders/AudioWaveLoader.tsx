import clsx from "clsx";
import React from "react";
import styles from "./Loaders.module.css";

export default function AudioWaveLoader() {
	return (
		<div className="flex items-center">
			<div className={clsx(styles["boxContainer"], "-mr-2 bg-white z-10")}>
				{[ 1, 2, 3, 4, 5 ].map((it) => (
					<div key={"box_" + it} className={clsx(styles["box"], styles[`box${it}`],
					// "bg-[#b14bf4]",
						"bg-indigo-600")}></div>
				))}
			</div>
			<div className="border-2 border-indigo-600 px-1 w-10 rounded-md -ml-2 loader-line-container">
				{[ 1, 2, 3, 4, 5, 6 ].map((it) => (
					<div key={"content_list_" + it} 
						className={clsx("my-1 before:bg-indigo-600",
							styles["loader-line"], "rounded", styles[`loader-line-box${it}`])}></div>
				))}
			</div>
		</div>
	);
}
