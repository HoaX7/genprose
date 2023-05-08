import React from "react";
import { connectStore } from "store/WithContext";
import { setGlobalStatus, setMetadata, setQueueMessage } from "store/actionCreators";
import { Metadata, StatusObject } from "@customTypes/Ai";
import TranscriptIndex from "components/Transcript";

const connect = connectStore((state, dispatch) => ({
	setGlobalStatus: (props) => setGlobalStatus(props)(dispatch),
	setQueueMessage: (props) => setQueueMessage(props),
	globalStatus: state.globalStatus,
	setMetadata: (props) => setMetadata(props)(dispatch)
}));

interface Props {
	setQueueMessage: (props: string) => void;
	setGlobalStatus: (props: StatusObject[]) => void;
	globalStatus: StatusObject[];
	setMetadata: (props: Metadata) => void;
}
function index(props: Props) {
	return (
		<div className="container mx-auto p-3">
			<TranscriptIndex setMetadata={props.setMetadata} />
		</div>
	);
}

export default connect(index);