import React from "react";
import { ButtonProps } from "../../../@customTypes/Button";
import styles from "./Button.module.css";
import clsx from "clsx";
import Typography from "../Typography/Typography";
import { Weight, FontSize, Variant } from "@customTypes/Typography";

const Button = (
	props: ButtonProps & {
    weight: Weight;
    font: FontSize;
    variant: Variant;
    textClassName?: string;
  }
) => {
	return (
		<Typography
			weight={props.weight}
			font={props.font}
			className={props.textClassName}
			variant={props.variant}
		>
			<button
				{...props}
				className={clsx(
					props.className,
					// styles.button,
					"disabled:opacity-50 disabled:cursor-not-allowed",
					"bg-indigo-600 text-white py-3 px-5 rounded-[63px]",
				)}
			>
				{props.children}
			</button>
		</Typography>
	);
};

export default Button;
