import { getContentByEmail } from "api/ai";
import React from "react";
import Transcript from "../components/Ai/Transcript";
import { connectStore } from "store/WithContext";
import { setGlobalStatus, setQueueMessage } from "store/actionCreators";
import { ContentProps, GeneratedContentProps, StatusObject } from "@customTypes/Ai";
import { GetServerSideProps } from "next";

const connect = connectStore((state, dispatch) => ({
	setGlobalStatus: (props) => setGlobalStatus(props)(dispatch),
	setQueueMessage: (props) => setQueueMessage(props),
	globalStatus: state.globalStatus
}));

interface Props {
	setQueueMessage: (props: string) => void;
	setGlobalStatus: (props: StatusObject[]) => void;
	globalStatus: StatusObject[];
	result?: ContentProps<GeneratedContentProps>[];
}
function index({ globalStatus, setGlobalStatus, setQueueMessage, result }: Props) {
	return (
		<div className="container mx-auto p-3">
			<Transcript 
				setGlobalStatus={setGlobalStatus}
				setQueueMessage={setQueueMessage}
				globalStatus={globalStatus}
				result={result}
			/>
		</div>
	);
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const cookies = ctx.req.cookies;
		if (!cookies.token) return { props: { result: [] } };
		const result = await getContentByEmail({
			content_type: "EXTRACT_CONTENT",
			cookies: ctx.req.cookies
		});
		return { props: { result: result.data || [] } };
	} catch (err) {
		console.log("pages.index.getInitialProps: ERROR", err);
		return {
			props: {
				error: true,
				message: "Unable to fetch content" 
			} 
		};
	}
};

export default connect(index);