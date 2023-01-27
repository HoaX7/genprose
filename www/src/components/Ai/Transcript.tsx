import React, { useState } from "react";
import { GeneratedContentProps, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractors from "./Extractors";
import GeneratedContents from "./GeneratedContents";
import GeneratedKeywords from "./GeneratedKeywords";

export default function Transcript() {
	const [ transcript, setTranscript ] = useState<TranscriptKeywordProps | null>(null);
	const [ result, setResult ] = useState<GeneratedContentProps[]>([]);

	return (
		<div className="grid grid-cols-3 md:divide-x divide-y md:divide-y-0">
			<div className="col-span-3 md:col-span-1 p-3">
				<Typography
					variant="div"
					font={18}
					weight="bold"
					className="underline mb-3"
				>
          Extractor
				</Typography>
				<Extractors onExtraction={(data) => setTranscript(data)} />
			</div>
			<div className="col-span-3 md:col-span-1 p-3">
				<Typography
					variant="div"
					font={18}
					weight="bold"
					className="underline mb-3"
				>
          Keywords
				</Typography>
				<GeneratedKeywords keywords={transcript?.keywords || []} 
					onResult={(data) => {
						const resp = structuredClone(result);
						resp.push(data);
						setResult(resp);
					}}
				/>
			</div>
			<div className="col-span-3 md:col-span-1 p-3">
				<Typography
					variant="div"
					font={18}
					weight="bold"
					className="underline mb-3"
				>
          Content Generated
				</Typography>
				<GeneratedContents data={result} />
			</div>
		</div>
	);
}
