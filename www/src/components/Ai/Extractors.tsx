import React, { useState } from "react";
import { ContentProps, PollParams, StatusObject, TranscriptKeywordProps } from "@customTypes/Ai";
import { executeFuncAndGetUniqueId } from "api/ai";
import { pollRequest } from "helpers/pollRequest";
import Button from "../Commons/ Button/Button";
import Input from "../Commons/Input/TextInput";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import Spinner from "../Commons/Loaders/Spinner";
import { clone } from "helpers";

interface P {
  onExtraction: (data: {
	  keywords: string[][];
	  transcript: string;
  }) => void;
  className?: string;
  useChatGpt?: boolean;
  onPolling: (bool: boolean) => void;
  setGlobalStatus: (props: StatusObject[]) => void;
  setQueueMessage: (props: string) => void;
  globalStatus: StatusObject[];
}
function Extractor({
	onExtraction,
	className,
	useChatGpt = false,
	onPolling,
	setGlobalStatus,
	setQueueMessage,
	globalStatus
}: P) {
	const [ url, setUrl ] = useState("");
	const [ saving, setSaving ] = useState(false);
	const [ polling, setPolling ] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!url) return;
			// setSaving(true);
			setPolling(true);
			// const resp = await executeFuncAndGetUniqueId({
			// 	data: {
			// 		url,
			// 		use_chatgpt_for_keywords: useChatGpt,
			// 	},
			// 	method: "POST",
			// 	url: "/ai/transcribe",
			// });
			// if (resp.error) throw resp;
			// if (!resp.data) throw new Error("No data found");
			// setQueueMessage("Your queue position is 5");
			// const res = clone<StatusObject[]>(globalStatus);
			// res.push({
			// 	content_type: "EXTRACT_AUDIO",
			// 	name: "Extract Transcript",
			// 	isComplete: false,
			// 	status: "QUEUED",
			// 	id: resp.data
			// });
			// setGlobalStatus(res);
			const resp = { data: "cc494b8969a248f2af8f8880fe00e602" };
			const result = await pollRequest<PollParams, string[][]>({
				method: "POST",
				data: { unique_id: resp.data },
				url: "/ai/retrieve_transcript",
				callback: (data) => {
					//
				},
				errorCallback: () => {
					setPolling(false);
				}
			});
			if (!result) throw new Error("Unable to fetch data");
			const newRes = clone<StatusObject[]>(globalStatus);
			const idx = newRes.findIndex((r) => r.id === resp.data);
			if (idx >= 0) {
				newRes[idx].isComplete = true;
				newRes[idx].status = "COMPLETED";
				setGlobalStatus(newRes);
			}
			onExtraction({
				keywords: result.content,
				transcript: result.args.text || "" 
			});
			if (result.args.generate_content_unique_id) {
				newRes.push({
					id: result.args.generate_content_unique_id,
					isComplete: false,
					status: "INPROGRESS",
					content_type: "EXTRACT_CONTENT",
					name: "Generating Sample Content"
				});
				setGlobalStatus(newRes);
				const contentRes = await pollRequest({
					method: "POST",
					data: { unique_id: result.args.generate_content_unique_id },
					url: "/ai/retrieve_transcript",
					callback: (data) => {
						//
					},
					errorCallback: () => {
						setPolling(false);
					}
				});
				console.log({ contentRes });
			}
			setPolling(false);
			return;
		} catch (err) {
			console.error("Failed to extract transcript: ", err);
			setPolling(false);
		}
		// setSaving(false);
	};

	return (
		<div className={className}>
			{saving && <FullpageLoader title="Extracting..." />}
			<form onSubmit={handleSubmit}>
				<div className="mb-2">
					{polling ? "We will email you when your content is ready" : ""}
				</div>
				<div>
					{/* <label htmlFor="yt">Enter YouTube URL</label> */}
					<div>
						<Input
							name="yt"
							placeholder="Enter YouTube url"
							value={url}
							disabled={saving}
							onChange={(e) => setUrl(e.target.value)}
							className="w-full"
						/>
					</div>
				</div>
				<div className="flex items-center mt-3">
					<Button type="submit" disabled={saving || !url || polling}>
            Extract Transcript
					</Button>
					{polling && (
						<span className="flex items-center">
							<Spinner size="xs" className="mx-2" />
              Extracting...
						</span>
					)}
				</div>
			</form>
		</div>
	);
}

export default Extractor;