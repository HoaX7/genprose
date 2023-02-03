import React, { Fragment, useState } from "react";
import {
	GeneratedContentProps,
	TranscriptKeywordProps,
} from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractors from "./Extractors";
import GeneratedContents from "./GeneratedContents";
import GeneratedKeywords from "./GeneratedKeywords";
import Textarea from "../Commons/Input/TextareaInput";
import { AlertErrorMessage } from "../Commons/Alerts";
import { getContentFromKeywords } from "../../api/ai";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import CollapsibleContent from "../Commons/CollapsibleContent";
import Dropdown from "../Commons/Dropdown";
import { AI_MODEL_ENGINES } from "../../helpers/constants";
import Input from "../Commons/Input/TextInput";

export default function Transcript() {
	const [ transcript, setTranscript ] = useState<TranscriptKeywordProps | null>();
	const [ result, setResult ] = useState<GeneratedContentProps[]>([]);
	const [ prompt, setPrompt ] = useState(
		"Generate a 100 word essay using this transcript"
	);
	const [ saving, setSaving ] = useState(false);
	const [ isChecked, setIsChecked ] = useState(true);
	const [ selectedModel, setSelectedModel ] = useState(
		AI_MODEL_ENGINES.TEXT_DAVINCI_003
	);

	const modelOptions = Object.keys(AI_MODEL_ENGINES).map((k) => ({
		label: AI_MODEL_ENGINES[k].name,
		value: k,
	}));
	return (
		<Fragment>
			<div className="px-3 flex flex-col flex-wrap gap-1">
				<div className="mr-2">
        Content Model Engine:{" "}
					<Dropdown
						className="mt-2"
						data={modelOptions}
						handleChange={(val) => {
							if (AI_MODEL_ENGINES[val]) {
								setSelectedModel(AI_MODEL_ENGINES[val]);
							}
						}}
					/>
				</div>
				<Typography
					variant="div"
					font={14}
					weight="regular"
				>
					{selectedModel.description}
				</Typography>
			</div>
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0">
				{saving && <FullpageLoader />}
				<div className="col-span-2 md:col-span-1 p-3">
					<Typography
						variant="div"
						font={18}
						weight="bold"
						className="underline mb-3"
					>
            Extractor
					</Typography>
					<Extractors onExtraction={(data) => setTranscript(data)} useChatGpt={isChecked} />
					<div className="mt-3">
						<Input type={"checkbox"} defaultChecked={isChecked} onChange={(e) => {
							setIsChecked(e.target.checked);
						}} />
						<label className="ml-2">Use chatgpt to extract keywords</label>
					</div>
					{transcript?.transcript && (
						<div className="mt-3">
							<CollapsibleContent
								content={transcript.transcript || "<i>No content available<i>"}
							/>
							<form
								className="mt-3"
								onSubmit={async (e) => {
									try {
										e.preventDefault();
										setSaving(true);
										const text =
                      prompt +
                      " generate using this transcript " +
                      transcript.transcript;
										const resp = await getContentFromKeywords({ prompt: text }, selectedModel.name);
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
								}}
							>
								<div>
									<Textarea
										value={prompt}
										onChange={(e) => setPrompt(e.target.value)}
										placeholder="Enter prompt"
										className="w-full h-28"
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
						</div>
					)}
				</div>
				<div className="col-span-2 md:col-span-1 p-3">
					<Typography
						variant="div"
						font={18}
						weight="bold"
						className="underline mb-3"
					>
            Keywords
					</Typography>
					<GeneratedKeywords
						keywords={transcript?.keywords || []}
						onResult={(data) => {
							const resp = structuredClone(result);
							resp.push(data);
							setResult(resp);
						}}
						selectedModel={selectedModel}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0 mt-3">
				<div className="col-span-2 md:col-span-2 p-3">
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
		</Fragment>
	);
}
