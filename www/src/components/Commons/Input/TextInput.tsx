import clsx from "clsx";
import React from "react";
import { InputProps } from "../../../@customTypes/Input";
import styles from "./Input.module.css";

const Index = (props: InputProps) => {
	return (
		<input 
			type="text"
			{...props}
			className={clsx(props.className, styles.input, "focus:outline-none",
				"disabled:opacity-75 disabled:pointer-events-none",
				"border rounded disabled:cursor-not-allowed")}
		/>
	);
};

export default Index;
