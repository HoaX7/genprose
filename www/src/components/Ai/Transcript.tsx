import React, { Fragment, useState } from "react";
import {
	ContentProps,
	GeneratedContentProps,
	PollParams,
	StatusObject,
} from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Extractors from "./Extractors";
import GeneratedContents from "./GeneratedContents";
import GeneratedKeywords from "./GeneratedKeywords";
import Textarea from "../Commons/Input/TextareaInput";
import { AlertErrorMessage } from "../Commons/Alerts";
import {
	executeFuncAndGetUniqueId,
	getContentFromKeywords,
	prepareContentParams,
} from "../../api/ai";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import CollapsibleContent from "../Commons/CollapsibleContent";
import Dropdown from "../Commons/Dropdown";
import { AI_MODEL_ENGINES, CONTENT_TYPES } from "../../helpers/constants";
import Input from "../Commons/Input/TextInput";
import { clone } from "../../helpers";
import { pollRequest } from "../../helpers/pollRequest";
import Spinner from "../Commons/Loaders/Spinner";

interface Props {
  setGlobalStatus: (props: StatusObject[]) => void;
  setQueueMessage: (props: string) => void;
  globalStatus: StatusObject[];
  result?: ContentProps<GeneratedContentProps>[];
  keywordResult?: ContentProps<string[][]>;
}
function Transcript({
	setGlobalStatus,
	setQueueMessage,
	globalStatus,
	result,
	keywordResult
}: Props) {
	const [ transcript, setTranscript ] = useState<string>(keywordResult?.args.text || "");
	const [ keywords, setKeywords ] = useState<string[][]>(keywordResult?.content || []);
	const [ _result, setResult ] = useState<ContentProps<GeneratedContentProps>[]>(
		result || []
	);
	const [ prompt, setPrompt ] = useState(
		"Generate a 100 word essay using this transcript"
	);
	const [ url, setUrl ] = useState(keywordResult?.args.link || "");
	const [ saving, setSaving ] = useState(false);
	const [ isChecked, setIsChecked ] = useState(true);
	const [ contentPolling, setContentPolling ] = useState<string[]>([]);
	const [ pollingKeywords, setPollingKeywords ] = useState(false);
	const [ selectedModel, setSelectedModel ] = useState(
		AI_MODEL_ENGINES.TEXT_DAVINCI_003
	);
	const [ infoText, setInfoText ] = useState(keywordResult ? "Showing your latest Transcript" : "");

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
			{infoText && (
				<Typography
					variant="div"
					weight="medium"
					font={14}
					className="mb-3"
				>
					<span className="bg-gray-200 py-1 pl-2 pr-3 rounded ">
						<img 
							src="assets/images/info.svg"
							alt="info"
							width={16}
							className="inline-block mb-1"
						/> {infoText}
					</span>
				</Typography>
			)}
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0 gap-4">
				{/* {saving && <FullpageLoader />} */}
				<div className="col-span-2 md:col-span-1">
					<Typography
						variant="div"
						font={18}
						weight="medium"
						className="underline mb-3"
					>
            Extractor
					</Typography>
					<Extractors
						setInfoText={setInfoText}
						setUrl={setUrl}
						url={url}
						onExtraction={(data) => {
							if (data.keywords) {
								setKeywords(data.keywords);
							}
							if (data.transcript) {
								setTranscript(data.transcript);
							}
							if (data.generatedContent) {
								setResult([ ..._result, data.generatedContent ]);
							}
						}}
						setGlobalStatus={setGlobalStatus}
						setQueueMessage={setQueueMessage}
						globalStatus={globalStatus}
						useChatGpt={isChecked}
						onPolling={() => {
							//
						}}
						// 		onPolling={(bool) => {
						// 			const res = clone(contentPolling);
						// 			if (bool && !contentPolling.includes(CONTENT_TYPES.EXTRACT_TRANSCRIPT)) {
						// 				res.push(CONTENT_TYPES.EXTRACT_TRANSCRIPT);
						// 			} else if (
						// 				!bool &&
						// contentPolling.includes(CONTENT_TYPES.EXTRACT_TRANSCRIPT)
						// 			) {
						// 				const idx = res.findIndex(
						// 					(c: string) => c === CONTENT_TYPES.EXTRACT_TRANSCRIPT
						// 				);
						// 				if (idx >= 0) res.splice(idx, 1);
						// 			}
						// 			setContentPolling(res);
						// 		}}
					/>
					{transcript && (
						<div className="mt-3">
							<CollapsibleContent
								content={transcript || "<i>No content available<i>"}
							/>
							<form
								className="mt-3"
								onSubmit={async (e) => {
									try {
										e.preventDefault();
										setSaving(true);
										let text =
                      prompt + " generate using this transcript " + transcript;

										text = prepareContentParams(text, selectedModel.name);
										const resp = await executeFuncAndGetUniqueId({
											method: "POST",
											data: {
												prompt: text,
												engine: selectedModel.name,
												is_priority: true,
												link: url
											},
											url: "/ai/generate_content",
										});
										if (resp.error || !resp.data) throw resp;
										const result = await pollRequest<PollParams, GeneratedContentProps>({
											method: "GET",
											data: { id: resp.data.id },
											url: "/ai/retrieve_transcript",
											callback: (data) => {
												// const res = clone(result);
												// res.push(data.content);
												// setResult(res);
												// setSaving(false);
											},
											errorCallback: () => {
												// setSaving(false);
											},
										});
										if (result) {
											const res =
                        clone<ContentProps<GeneratedContentProps>[]>(_result);
											res.push(result);
											setResult(res);
										}
										setSaving(false);
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
				<div className="col-span-2 md:col-span-1 pl-3">
					<Typography
						variant="div"
						font={18}
						weight="medium"
						className="underline mb-3"
					>
            Keywords
						{/* <Button
							type="button"
							disabled={!transcript}
							className="mx-2"
							onClick={async () => {
								try {
									if (!transcript) return;
									setPollingKeywords(true);
									const resp = await executeFuncAndGetUniqueId({
										method: "POST",
										data: {
											text: transcript,
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
						</Button> */}
					</Typography>
					{/* <div className="mt-3">
						<Input
							type={"checkbox"}
							defaultChecked={isChecked}
							onChange={(e) => {
								setIsChecked(e.target.checked);
							}}
						/>
						<label className="ml-2">Use chatgpt to extract keywords</label>
					</div> */}
					<GeneratedKeywords
						keywords={keywords || []}
						onResult={(data) => {
							const resp = clone<ContentProps<GeneratedContentProps>[]>(_result);
							resp.push(data);
							setResult(resp);
						}}
						link={url}
						selectedModel={selectedModel}
						loading={pollingKeywords}
						polling={contentPolling.includes(CONTENT_TYPES.EXTRACT_CONTENT)}
						setPolling={(bool) => {
							// const res = clone(contentPolling);
							// if (bool && !contentPolling.includes(CONTENT_TYPES.EXTRACT_CONTENT)) {
							// 	res.push(CONTENT_TYPES.EXTRACT_CONTENT);
							// } else if (!bool && contentPolling.includes(CONTENT_TYPES.EXTRACT_CONTENT)) {
							// 	const idx = res.findIndex((c: string) => c === CONTENT_TYPES.EXTRACT_CONTENT);
							// 	if (idx >= 0) {
							// 		res.splice(idx, 1);
							// 	}
							// }
							// setContentPolling(res);
						}}
					/>
				</div>
			</div>
			<div className="grid grid-cols-2 md:divide-x divide-y md:divide-y-0 mt-3">
				<div className="col-span-2 md:col-span-2">
					<div className="flex items-center mb-3">
						<Typography
							variant="div"
							font={18}
							weight="medium"
							className="underline"
						>
              Content Generated
						</Typography>
						{contentPolling.includes(CONTENT_TYPES.EXTRACT_CONTENT) ||
            saving ? (
								<div className="flex items-center text-gray-600">
									<Spinner size="xxs" className="mx-2" /> Generating content...
								</div>
							) : (
								""
							)}
					</div>
					<GeneratedContents data={_result} />
				</div>
			</div>
		</Fragment>
	);
}

export default Transcript;
