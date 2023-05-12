import clsx from "clsx";
import Router from "next/router";
import React from "react";
import Button from "../Button/Button";
import Typography from "../Typography/Typography";

interface Props {
  message?: string;
  title?: string;
}
export default function Error({
	message = "We cound not process your request. Please try again.",
	title = "Something weng wrong",
}: Props) {
	return (
		<div
			className={clsx(
				"mx-auto mt-32",
				"w-full md:w-9/12 lg:w-5/12 text-center"
			)}
		>
			<Typography weight="medium" font={16} variant="div">
				{title}
			</Typography>
			<Typography
				variant="p"
				weight="regular"
				font={14}
				className="text-gray-500"
			>
				{message}
			</Typography>
			<Button
				type="button"
				className="mt-3"
				onClick={(e) => {
					e.preventDefault();
					Router.push("/");
				}}
				font={16}
				weight="regular"
				variant="span"
			>
        Retry
			</Button>
		</div>
	);
}
