import { StatusObject, TestTranscriptData } from "@customTypes/Ai";
import CollapsibleContent from "components/Commons/CollapsibleContent";
import Typography from "components/Commons/Typography/Typography";
import { clone } from "helpers";
import React, { useState } from "react";
import EachTestTranscript from "./EachTestTranscript";
import Extractor from "./Extractors";

interface Props {
  setGlobalStatus: (props: StatusObject[]) => void;
  setQueueMessage: (props: string) => void;
  globalStatus: StatusObject[];
  result?: TestTranscriptData[];
}
export default function TestTranscripts({
	setGlobalStatus,
	setQueueMessage,
	globalStatus,
	result,
}: Props) {
	const [ url, setUrl ] = useState("");
	const [ infoText, setInfoText ] = useState("");
	const [ _result, setResult ] = useState(result);
	return (
		<div>
			<Extractor
				setUrl={setUrl}
				url={url}
				setGlobalStatus={setGlobalStatus}
				setQueueMessage={setQueueMessage}
				globalStatus={globalStatus}
				useChatGpt={true}
				onPolling={() => {
					return;
				}}
				setInfoText={setInfoText}
				onExtraction={(data) => {
					const res: TestTranscriptData[] = clone(_result);
					res.splice(0, 0, data);
					setResult(res);
				}}
			/>
			<div className="mt-3">
				<Typography
					className="underline"
					variant="h2"
					weight="medium"
					font={18}
				>
          Transcripts
				</Typography>
				{!_result || (_result.length <= 0 && <div>No data available</div>)}
				{_result?.map((item, i) => (
					<EachTestTranscript item={item} key={"transcript_" + item.id} i={i}  />
				))}
			</div>
		</div>
	);
}
