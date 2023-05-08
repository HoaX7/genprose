import { ContentProps, Metadata } from "@customTypes/Ai";
import { getContentById } from "api/ai";
import ContentIndex from "components/Content";
import { GetServerSideProps } from "next";
import React from "react";
import { setMetadata } from "store/actionCreators";
import { connectStore } from "store/WithContext";

const con = connectStore((state, dispatch) => ({
	setMetadata: (props: Metadata) => setMetadata(props)(dispatch),
	profile: state.profile
}));

interface Props {
  result?: ContentProps;
  setMetadata: (props: Metadata) => void;
}
function Index({ result, setMetadata }: Props) {
	return (
		<div className="container mx-auto p-3">
			<ContentIndex result={result} setMetadata={setMetadata} />
		</div>
	);
}

export default con(Index);

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
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
	} catch (err) {
		console.error("content.id.getServerSideProps: Failed", err);
		return { props: { error: "Unable to fetch content" } };
	}
};
