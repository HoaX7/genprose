import React from "react";
import { GeneratedContentProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";

const Content = ({ choices }: P["data"][1]) => {
	return (
		<div className="bg-gray-200 rounded p-3 mb-3">
			{choices[0].text}
		</div>
	);
};

interface P {
    data: GeneratedContentProps[];
}
export default function GeneratedContents({ data = [] }: P) {
	if (!data || data.length <= 0) {
		return <Typography
			variant="div"
			font={16}
			weight="regular"
			className="italic"
		>
        No data available
		</Typography>;
	}
	return (
		<>
			{data.map((item) => (
				<Content key={item.id} {...item} />
			))}
		</>
	);
}
