import React from "react";
import { GeneratedContentProps } from "../../@customTypes/Ai";
import CollapsibleContent from "../Commons/CollapsibleContent";
import Typography from "../Commons/Typography/Typography";

const Content = ({ choices }: P["data"][1]) => {
	return (
		<CollapsibleContent content={(choices[0] || "").text || "<i>No Content available<i>"} />
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
		<div className="grid grid-cols-3 gap-4">
			{data.map((item) => (
				<div key={item.id} className="col-3 md:col-1">
					<Content {...item} />
				</div>
			))}
		</div>
	);
}
