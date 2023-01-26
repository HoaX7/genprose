import React from "react";
import { GeneratedContentProps } from "../../@customTypes/Ai";

interface P {
    data: GeneratedContentProps;
}
export default function GeneratedContent({ data }: P) {
	return (
		<div className="bg-gray-200 rounded p-3">
			{data.choices[0].text}
		</div>
	);
}
