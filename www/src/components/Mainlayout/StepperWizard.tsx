import { Metadata } from "@customTypes/Ai";
import clsx from "clsx";
import Typography from "components/Commons/Typography/Typography";
import { STEPPER_KEYS } from "helpers/constants";
import Router from "next/router";
import React from "react";

const steps = [
	{
		key: STEPPER_KEYS.AUDIO_FILE,
		name: "Paste Your URL",
		href: "/"
	},
	{
		key: STEPPER_KEYS.PERSONA,
		name: "Choose Persona / Tone",
	},
	{
		key: STEPPER_KEYS.GENERATE_CONTENT,
		name: "Generate Content",
	},
];

const tick = () => {
	return (
		<svg
			aria-hidden="true"
			className="w-6 h-6 mr-2"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fillRule="evenodd"
				// eslint-disable-next-line max-len
				d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
				clipRule="evenodd"
			></path>
		</svg>
	);
};

interface Props {
    stepper: string[];
    setMetadata: (props: Metadata) => void;
}
export default function StepperWizard({ stepper, setMetadata }: Props) {
	return (
		<div className="container mx-auto p-3 pb-5">
			<ol
				className={clsx(
					"flex items-start gap-4 md:gap-0",
					"md:items-center w-full text-sm",
					"font-medium text-center sm:text-base",
					"flex-col md:flex-row"
				)}
			>
				{steps.map((step, i) => (
					<li
						className={clsx(
							"flex items-center text-white sm:after:content-['']",
							"after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden",
							"sm:after:inline-block after:mx-5",
							i === 2 ? "after:w-0" : "after:w-10",
							step.href ? "cursor-pointer" : ""
						)}
						key={"step_" + i}
						onClick={() => {
							if (step.href) {
								setMetadata({ stepper: [] });
								Router.push(step.href, undefined, { shallow: true });
							}
						}}
					>
						{stepper.includes(step.key) ? tick() : (
							<Typography
								className={clsx(
									"flex items-center justify-center w-6 h-6",
									"border border-white rounded-full shrink-0",
									"mr-2"
								)}
								variant="span"
								weight="medium"
								font={12}
							>
								{i + 1}
							</Typography>
						)}
						{step.name}
					</li>
				))}
			</ol>
		</div>
	);
}
