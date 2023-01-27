import React, { useState } from "react";
import { GeneratedContentProps, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractors from "./Extractors";
import GeneratedContents from "./GeneratedContents";
import GeneratedKeywords from "./GeneratedKeywords";
import Input from "../Commons/Input/TextInput";
import { AlertErrorMessage } from "../Commons/Alerts";
import { getContentFromKeywords } from "../../api/ai";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";

export default function Transcript() {
	const [ transcript, setTranscript ] = useState<TranscriptKeywordProps | null>(null);
	const [ result, setResult ] = useState<GeneratedContentProps[]>([]);
	const [ prompt, setPrompt ] = useState("");
	const [ saving, setSaving ] = useState(false);

	return (
		<div className="grid grid-cols-3 md:divide-x divide-y md:divide-y-0">
			{saving && <FullpageLoader />}
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
				{transcript?.transcript && (
					<div className="mt-3">
						<form onSubmit={async (e) => {
							try {
								e.preventDefault();
								setSaving(true);
								let text = prompt + " generate using this transcript " + transcript.transcript;

								// Allowed max chars by ChatGPT
								if (text.length > 4097) {
									text = text.substring(0, 4097);
								}
								const resp = await getContentFromKeywords({ prompt: text });
								if (resp.error) throw resp;
								if (resp.data) {
									const res = structuredClone(result);
									res.push(resp.data);
									setResult(res);
								}
							} catch (err) {
								console.log("Transcript error", err);
								AlertErrorMessage({ text: "Unable to generate content" });
							}
							setSaving(false);
						}}>
							<div>
								<Input 
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									placeholder="Enter prompt"
									className="w-full"
								/>
							</div>
							<Button
								type="submit"
								disabled={!prompt || saving}
								className="mt-3"
							>
                Generate from transcript
							</Button>
						</form>
						<div className="mt-3 rounded bg-gray-200 p-3">
							{transcript.transcript}
						</div>
					</div>
				)}
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
