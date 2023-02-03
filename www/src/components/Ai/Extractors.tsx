import React, { useState } from "react";
import { TranscriptKeywordProps } from "../../@customTypes/Ai";
import { getTranscriptionAndKeywordsFromURL } from "../../api/ai";
import Button from "../Commons/ Button/Button";
import Input from "../Commons/Input/TextInput";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";

interface P {
    onExtraction: (data: TranscriptKeywordProps) => void;
    className?: string;
	useChatGpt?: boolean;
}
export default function Extractor({ onExtraction, className, useChatGpt = false }: P) {
	const [ url, setUrl ] = useState("");
	const [ saving, setSaving ] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!url) return;
			setSaving(true);
			const result = await getTranscriptionAndKeywordsFromURL({
				url,
				use_chatgpt_for_keywords: useChatGpt 
			});
			if (result.error) throw result;
			if (result.data) onExtraction(result.data);
		} catch (err) {
			console.error("Failed to extract transcript: ", err);
		}
		setSaving(false);
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
				<Button 
					type="submit"
					disabled={saving || !url}
					className="mt-3"
				>
                    Extract Transcript
				</Button>
			</form>
		</div>
	);
}
