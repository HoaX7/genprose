import React from "react";
import styles from "./Typography.module.css";
import clsx from "clsx";
import { TypographyProps } from "../../../@customTypes/Typography";

interface Props extends TypographyProps {
    children:
        | JSX.Element
        | JSX.Element[]
        | string
        | string[]
        | number
        | number[]
        | (string | JSX.Element | number)[]
		| React.ReactNode;
    className?: string;
	onClick?: React.MouseEventHandler<HTMLHeadingElement>;
}

export default function Typography({
	variant = "span",
	children,
	className,
	font = 16,
	weight = "regular",
	onClick
}: Props) {
	const Container = variant;
	return (
		<Container
			className={clsx(className, styles[`font-${font}`], styles[weight])}
			onClick={onClick}
		>
			{children}
		</Container>
	);
}
