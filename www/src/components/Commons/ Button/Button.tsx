import React from "react";
import { ButtonProps } from "../../../@customTypes/Button";
import styles from "./Button.module.css";
import clsx from "clsx";

const Button = (props: ButtonProps) => {
	return (
		<button
			{...props}
			className={clsx(
				props.className,
				// styles.button,
				"py-1 px-2 rounded disabled:opacity-50 disabled:cursor-not-allowed",
				"bg-gray-200"
			)}
		>
			{props.children}
		</button>
	);
};

export default Button;
