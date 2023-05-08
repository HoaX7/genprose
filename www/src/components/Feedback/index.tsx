import clsx from "clsx";
import Typography from "components/Commons/Typography/Typography";
import React, { useState } from "react";

const emojis = [
	{ name: "😣" },
	{ name: "😕" },
	{ name: "😬" },
	{ name: "🙂" },
	{ name: "🤩" },
];

interface Props {
    onExplodeConfetti: () => void;
}
export default function index({ onExplodeConfetti }: Props) {
	const [ submitted, setSubmitted ] = useState(false);
	return (
		<div className="bg-site-secondary-transparent p-5 rounded-xl">
			<Typography weight="medium" font={16} variant="div">
				{submitted ? "Thank you!" : "How would you rate your content?"}
			</Typography>
			<Typography
				variant="div"
				weight="regular"
				font={14}
				className="text-gray-600"
			>
				{submitted
					? "Your feedback is an important part of our ongoing efforts to improve our cnotent quality."
					: "By sharing your feedback you're helping us improve our services."}
			</Typography>
			{submitted === false && (
				<div className="flex gap-4 mt-3 flex-wrap">
					{emojis.map(({ name }, i) => (
						<Typography
							key={"feedback_emoji_" + i}
							weight="regular"
							font={30}
							variant="div"
							className={clsx(
								"bg-[#f3f7ff] px-3 hover:shadow-lg cursor-pointer",
								"rounded-xl"
							)}
							onClick={() => {
								onExplodeConfetti();
								setSubmitted(true);
							}}
						>
							{name}
						</Typography>
					))}
				</div>
			)}
		</div>
	);
}
