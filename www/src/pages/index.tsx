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
	keywordResult?: ContentProps<string[][]>[];
}
function index({
	globalStatus, setGlobalStatus, setQueueMessage, result, keywordResult 
}: Props) {
	return (
		<div className="container mx-auto p-3">
			<Transcript 
				setGlobalStatus={setGlobalStatus}
				setQueueMessage={setQueueMessage}
				globalStatus={globalStatus}
				result={result}
				// Show latest only
				keywordResult={(keywordResult || [])[0]}
			/>
		</div>
	);
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		const cookies = ctx.req.cookies;
		if (!cookies.token) return {
			props: {
				result: [],
				keywordResult: [] 
			} 
		};
		const result = await getContentByEmail({
			content_type: "EXTRACT_CONTENT",
			cookies: ctx.req.cookies
		});
		const keywords = await getContentByEmail({
			content_type: "EXTRACT_KEYWORDS",
			cookies: ctx.req.cookies
		});

		// running into Recursive use of cursors not allowed. Error on backend
		// const [ result, keywords ] = await Promise.all([
		// 	getContentByEmail<ContentProps<GeneratedContentProps[]>>({
		// 		content_type: "EXTRACT_CONTENT",
		// 		cookies: ctx.req.cookies
		// 	}),
		// 	getContentByEmail<ContentProps<string[][]>>({
		// 		content_type: "EXTRACT_KEYWORDS",
		// 		cookies: ctx.req.cookies
		// 	})
		// ]);
		return {
			props: {
				result: result.data || [],
				keywordResult: keywords.data 
			} 
		};
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