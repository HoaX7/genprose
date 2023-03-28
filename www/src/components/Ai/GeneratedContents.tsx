import React, { Fragment } from "react";
import { ContentProps, GeneratedContentProps } from "../../@customTypes/Ai";
import CollapsibleContent from "../Commons/CollapsibleContent";
import Typography from "../Commons/Typography/Typography";

const Content = ({ choices, link = "not-found" }: GeneratedContentProps & { link?: string; }) => {
	let content = "<i>No content available</i>";
	if (choices && choices[0].text) {
		content = choices[0].text;
		content =
      content +
      `<div>Content is inspiried by 
	  <a class="text-blue-500 underline" href={${link}} target="_blank">${link}</a></div>`;
	}
	return (
		<CollapsibleContent content={content} />
	);
};

interface P {
    data: ContentProps<GeneratedContentProps>[];
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
		<div className="grid grid-cols-2 gap-4">
			{data.map((item) => (
				<div key={item.unique_id + "_content_generated"} className="col-span-2 md:col-span-1 relative">
					<a className="hover:underline text-blue-500 absolute z-10 mx-2 mt-1 hover:cursor-pointer"
						target={"_blank"}
						href={`/content/${item.unique_id}`} rel="noreferrer"
					>
						New Tab
					</a>
					<Content {...item.content} link={item.args.link} />
				</div>
			))}
		</div>
	);
}
