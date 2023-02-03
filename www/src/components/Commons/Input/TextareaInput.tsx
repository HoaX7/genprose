import React from "react";
import clsx from "clsx";
import { TextareaProps } from "../../../@customTypes/Input";
import styles from "./Input.module.css";

const Index = (props: TextareaProps) => {
	return (
		<>
			<textarea 
				{...props} 
				className={clsx(props.className, styles.textarea, "focus:outline-none",
					"disabled:opacity-75 disabled:pointer-events-none disabled:cursor-not-allowed",
					"border rounded")}
			/>
		</>
	);
};

export default Index;
