import Pre from "components/Commons/Pre";
import Typography from "components/Commons/Typography/Typography";
import React from "react";

interface Props {
  result: string[];
}
export default function ShowContent({ result, }: Props) {
	return (
		<div className="mb-3">
			<Typography weight="medium" font={16} variant="div" className="my-3">
            			Hooray, your content is ready!{" "}
				{/* <img
					alt="copy"
					width={16}
					src="../assets/images/copy.svg"
					className="inline cursor-pointer hover:bg-gray-100"
					loading="eager"
				/> */}
			</Typography>
			<Pre content={result[0].trim()} />
		</div>
	);
}
