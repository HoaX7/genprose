import React, { useState } from "react";
import { ContentProps, PollParams, TranscriptKeywordProps } from "../../@customTypes/Ai";
import { executeFuncAndGetUniqueId } from "../../api/ai";
import { pollRequest } from "../../helpers/pollRequest";
import Button from "../Commons/ Button/Button";
import Input from "../Commons/Input/TextInput";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import Spinner from "../Commons/Loaders/Spinner";

interface P {
  onExtraction: (data: ContentProps) => void;
  className?: string;
  useChatGpt?: boolean;
  onPolling: (bool: boolean) => void;
}
export default function Extractor({
	onExtraction,
	className,
	useChatGpt = false,
	onPolling,
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
			const resp = await executeFuncAndGetUniqueId({
				data: {
					url,
					use_chatgpt_for_keywords: useChatGpt,
				},
				method: "POST",
				url: "/ai/transcribe",
			});
			if (resp.error) throw resp;
			if (!resp.data) throw new Error("No data found");
			await pollRequest<PollParams, string>({
				method: "POST",
				data: { unique_id: resp.data },
				url: "/ai/retrieve_transcript",
				callback: (data) => {
					onExtraction(data);
					setPolling(false);
					return;
				},
				errorCallback: () => {
					setPolling(false);
				}
			});
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
					<Button type="submit" disabled={saving || !url}>
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
