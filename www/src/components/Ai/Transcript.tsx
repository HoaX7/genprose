import React, { Fragment, useState } from "react";
import { ContentProps, GeneratedContentProps, PollParams } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractors from "./Extractors";
import GeneratedContents from "./GeneratedContents";
import GeneratedKeywords from "./GeneratedKeywords";
import Textarea from "../Commons/Input/TextareaInput";
import { AlertErrorMessage } from "../Commons/Alerts";
import { executeFuncAndGetUniqueId, getContentFromKeywords, prepareContentParams } from "../../api/ai";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import CollapsibleContent from "../Commons/CollapsibleContent";
import Dropdown from "../Commons/Dropdown";
import { AI_MODEL_ENGINES, CONTENT_TYPES } from "../../helpers/constants";
import Input from "../Commons/Input/TextInput";
import { clone } from "../../helpers";
import { pollRequest } from "../../helpers/pollRequest";
import Spinner from "../Commons/Loaders/Spinner";

export default function Transcript() {
	const [ transcript, setTranscript ] = useState<ContentProps>();
	const [ keywords, setKeywords ] = useState<ContentProps<string[][]>>();
	const [ result, setResult ] = useState<GeneratedContentProps[]>([]);
	const [ prompt, setPrompt ] = useState(
		"Generate a 100 word essay using this transcript"
	);
	const [ saving, setSaving ] = useState(false);
	const [ isChecked, setIsChecked ] = useState(true);
	const [ contentPolling, setContentPolling ] = useState<string[]>([]);
	const [ pollingKeywords, setPollingKeywords ] = useState(false);
	const [ selectedModel, setSelectedModel ] = useState(
		AI_MODEL_ENGINES.TEXT_DAVINCI_003
	);

	const modelOptions = Object.keys(AI_MODEL_ENGINES).map((k) => ({
		label: AI_MODEL_ENGINES[k].name,
		value: k,
	}));
	return (
		<Fragment>
			{/* <div className="px-3 flex flex-col flex-wrap gap-1">
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
			</div> */}
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0">
				{/* {saving && <FullpageLoader />} */}
				<div className="col-span-2 md:col-span-1 p-3">
					<Typography
						variant="div"
						font={18}
						weight="bold"
						className="underline mb-3"
					>
            Extractor
					</Typography>
					<Extractors
						onExtraction={(data) => setTranscript(data)}
						useChatGpt={isChecked}
						onPolling={(bool) => {
							const res = clone(contentPolling);
							if (bool && !contentPolling.includes(CONTENT_TYPES.TRANSCRIPT)) {
								res.push(CONTENT_TYPES.TRANSCRIPT);
							} else if (
								!bool &&
                contentPolling.includes(CONTENT_TYPES.TRANSCRIPT)
							) {
								const idx = res.findIndex(
									(c: string) => c === CONTENT_TYPES.TRANSCRIPT
								);
								if (idx >= 0) res.splice(idx, 1);
							}
							setContentPolling(res);
						}}
					/>
					{transcript?.content && (
						<div className="mt-3">
							<CollapsibleContent
								content={transcript.content || "<i>No content available<i>"}
							/>
							<form
								className="mt-3"
								onSubmit={async (e) => {
									try {
										e.preventDefault();
										setSaving(true);
										let text =
										prompt +
										" generate using this transcript " +
										transcript.content;

										text = prepareContentParams(text, selectedModel.name);
										const resp = await executeFuncAndGetUniqueId({
											method: "POST",
											data: {
												prompt: text,
												engine: selectedModel.name 
											},
											url: "/ai/generate_content"
										});
										if (resp.error || !resp.data) throw resp;
										await pollRequest<PollParams, GeneratedContentProps>({
											method: "POST",
											data: { unique_id: resp.data },
											url: "/ai/retrieve_transcript",
											callback: (data) => {
												const res = clone(result);
												res.push(data.content);
												setResult(res);
												setSaving(false);
											},
											errorCallback: () => {
												setSaving(false);
											}
										});
									} catch (err) {
										console.log("Transcript error", err);
										AlertErrorMessage({ text: "Unable to generate content" });
										setSaving(false);
									}
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
						<Button
							type="button"
							disabled={!transcript?.content}
							className="mx-2"
							onClick={async () => {
								try {
									if (!transcript?.content) return;
									setPollingKeywords(true);
									const resp = await executeFuncAndGetUniqueId({
										method: "POST",
										data: {
											text: transcript.content,
											use_chatgpt_for_keywords: isChecked 
										},
										url: "/ai/extract_keywords"
									});
									if (resp.error) throw resp;
									if (!resp.data) throw new Error("Unable to load data");
									await pollRequest<PollParams, string[][]>({
										method: "POST",
										data: { unique_id: resp.data },
										url: "/ai/retrieve_transcript",
										callback: (data) => {
											setKeywords(data);
											setPollingKeywords(false);
											return;
										},
										errorCallback: () => {
											setPollingKeywords(false);
										}
									});
								} catch (err) {
									console.log("Unable to get keywords:", err);
									setPollingKeywords(false);
								}
							}}
						>
              Get keywords
						</Button>
					</Typography>
					<div className="mt-3">
						<Input
							type={"checkbox"}
							defaultChecked={isChecked}
							onChange={(e) => {
								setIsChecked(e.target.checked);
							}}
						/>
						<label className="ml-2">Use chatgpt to extract keywords</label>
					</div>
					<GeneratedKeywords
						keywords={keywords?.content || []}
						onResult={(data) => {
							const resp = clone(result);
							resp.push(data);
							setResult(resp);
						}}
						selectedModel={selectedModel}
						loading={pollingKeywords}
						polling={contentPolling.includes(CONTENT_TYPES.CONTENT)}
						setPolling={(bool) => {
							const res = clone(contentPolling);
							if (bool && !contentPolling.includes(CONTENT_TYPES.CONTENT)) {
								res.push(CONTENT_TYPES.CONTENT);
							} else if (!bool && contentPolling.includes(CONTENT_TYPES.CONTENT)) {
								const idx = res.findIndex((c: string) => c === CONTENT_TYPES.CONTENT);
								if (idx >= 0) {
									res.splice(idx, 1);
								}
							}
							setContentPolling(res);
						}}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0 mt-3">
				<div className="col-span-2 md:col-span-2 p-3">
					<div className="flex items-center mb-3">
						<Typography
							variant="div"
							font={18}
							weight="bold"
							className="underline"
						>
            Content Generated
						</Typography>
						{(contentPolling.includes(CONTENT_TYPES.CONTENT) || saving) ? (
							<div className="flex items-center text-gray-600">
								<Spinner size="xxs" className="mx-2" /> Generating content...
							</div>
						) : ""}
					</div>
					<GeneratedContents data={result} />
				</div>
			</div>
		</Fragment>
	);
}
