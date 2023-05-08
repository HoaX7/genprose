import clsx from "clsx";
import Typography from "components/Commons/Typography/Typography";
import Pre from "components/Commons/Pre";
import React, { useState } from "react";
import { numericWithComma } from "helpers";

interface Props {
    content: string;
	className?: string;
}
export default function ShowTranscript({ content, className }: Props) {
	const [ showTranscript, setShowTranscript ] = useState(true);
	return (
		<div className={className}>
			<Typography
				variant="div"
				weight="medium"
				font={16}
				className="bg-gray-100 p-2 rounded cursor-pointer flex items-center justify-between"
				onClick={() => setShowTranscript(!showTranscript)}
			>
              Transcript{" "}({numericWithComma(content.length)})
				<img
					src="/assets/images/caret.svg"
					width={16}
					className={clsx(
						showTranscript ? "rotate-90" : "-rotate-90",
						"ease-in-out transition duration-300"
					)}
				/>
			</Typography>
			{showTranscript && (
				<Pre
					className="mt-3 mx-2"
					content={content}
				/>
			)}
		</div>
	);
}
