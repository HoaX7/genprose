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
        | (string | JSX.Element | number)[];
    className?: string;
	onClick?: React.MouseEventHandler<HTMLHeadingElement>;
}

export default function Typography({
	variant,
	children,
	className,
	font,
	weight,
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
