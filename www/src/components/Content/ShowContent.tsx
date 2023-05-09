import Pre from "components/Commons/Pre";
import SuccessTicketIcon from "components/Commons/StatusMenu/SuccessTicketIcon";
import Typography from "components/Commons/Typography/Typography";
import React, { useEffect, useRef, useState } from "react";

interface Props {
  result: string[];
}
export default function ShowContent({ result, }: Props) {
	const [ copied, setCopied ] = useState(false);
	const text = ((result || [])[0] || "").trim();

	const clipboardTimeout: any = useRef();
	useEffect(() => {
		if (copied) {
			clipboardTimeout.current = setTimeout(() => {
				setCopied(false);
			}, 2000);
		}
		return () => clearTimeout(clipboardTimeout.current);
	}, [ copied ]);

	return (
		<div className="mb-3">
			<Typography weight="medium" font={16} variant="div" className="my-3">
            			Hooray, your content is ready!{" "}
				{copied ? (
					(
						<Typography
							font={14}
							weight="regular"
							variant="span"
						>
							Copied <SuccessTicketIcon className="accent-white" />
						</Typography>
					)
				) : <img
					alt="copy"
					width={16}
					src="../assets/images/copy.svg"
					className="inline cursor-pointer hover:bg-gray-100"
					loading="eager"
					onClick={() => {
						navigator.clipboard.writeText(text);
						setCopied(true);
					}}
				/>}
			</Typography>
			<Pre content={result[0].trim()} />
		</div>
	);
}
