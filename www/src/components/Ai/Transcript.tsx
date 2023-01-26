import React, { useState } from "react";
import { GeneratedContentProps, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractor from "./Extractor";
import GeneratedContent from "./GeneratedContent";

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
				<Extractor onExtraction={(data) => setTranscript(data)} />
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
				{(transcript && (transcript.keywords || []).length > 0) &&
        transcript.keywords.map((item, i) => (
        	<div key={"keyword_" + i} className="bg-gray-200 p-3">
        		{item.join(", ")}
        	</div>
        ))}
				{(!transcript || (transcript.keywords || []).length <= 0) && (
					<Typography
						variant="div"
						font={16}
						weight="regular"
						className="italic"
					>
            No data available
					</Typography>
				)}
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
				<GeneratedContent data={{ choices: [ { text: "Helloworld" } ] } as GeneratedContentProps} />
			</div>
		</div>
	);
}
