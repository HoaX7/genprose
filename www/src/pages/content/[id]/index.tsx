import { ContentProps, GeneratedContentProps } from "@customTypes/Ai";
import { getContentById } from "api/ai";
import Typography from "components/Commons/Typography/Typography";
import { GetServerSideProps } from "next";
import React from "react";

interface Props {
  result?: ContentProps<GeneratedContentProps>;
}
export default function Index({ result }: Props) {
	let content = "<i>No content available</i>";
	if (result?.content?.choices && result.content.choices[0].text) {
		const link = result.args.link;
		content = result.content.choices[0].text;
		content =
      content +
      `<div>Content is inspiried by 
	  <a class="text-blue-500 underline" href={${link}} target="_blank">${link}</a></div>`;
	}
	return (
		<div className="container mx-auto p-3">
			<Typography
				variant="div"
				font={18}
				weight="medium"
			>
				What to restrict access to content? Go Premium!
			</Typography>
			<div className="bg-gray-200 p-3 rounded mt-3">
				<div dangerouslySetInnerHTML={{ __html: content }}></div>
			</div>
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	let id = ctx.params?.id;
	if (!id)
		return {
			props: {
				error: true,
				message: "Invalid content ID",
			},
		};
	if (typeof id === "object") {
		id = id[0];
	}
	const result = await getContentById({ id });
	return { props: { result: result.data } };
};
