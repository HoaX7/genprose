import React, { useState } from "react";
import { ContentProps, GeneratedContentProps, PollParams, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import TextareaInput from "../Commons/Input/TextareaInput";
import Button from "../Commons/ Button/Button";
import { AlertErrorMessage } from "../Commons/Alerts";
import { executeFuncAndGetUniqueId, getContentFromKeywords, prepareContentParams } from "../../api/ai";
import Spinner from "../Commons/Loaders/Spinner";
import clsx from "clsx";
import { AI_MODEL_ENGINES, MAX_ALLOWED_KEYWORDS } from "../../helpers/constants";
import { clone } from "../../helpers";
import { pollRequest } from "../../helpers/pollRequest";

interface K {
    item: string[];
    idx: number;
    handleClick: (item: string) => void;
    selectedKeywords: string[];
}
const Keyword = ({ item, idx, handleClick, selectedKeywords }: K) => {
	return (
		<div className='mb-3 rounded'>
			{idx}# {item.map((val, i) => (
				<Button key={"keyword_" + i} className={clsx("hover:!bg-blue-100",
					selectedKeywords.includes(val) ? "!bg-blue-100" : "!bg-white")}
				    onClick={() => handleClick(val)}
				disabled={selectedKeywords.length >= MAX_ALLOWED_KEYWORDS}
				>
					{val}{" ,"}
				</Button>
			))}
		</div>
	);
};

interface P {
    keywords: TranscriptKeywordProps["keywords"];
    onResult: (data: ContentProps<GeneratedContentProps>) => void;
    selectedModel: typeof AI_MODEL_ENGINES[""];
	loading: boolean;
	setPolling: (bool: boolean) => void;
	polling: boolean;
	link: string;
}
export default function GeneratedKeywords({
	keywords = [], onResult, selectedModel, loading = false, setPolling, polling, link
}: P) {
	const [ selectedkeywords, setSelectedKeywords ] = useState<string[]>([]);
	const [ saving, setSaving ] = useState(false);
	const [ text, setText ] = useState("Generate 100 words using these keywords");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (!text) return;
			setSaving(true);
			let prompt = text + " using keywords " + selectedkeywords.join(", ");
			prompt = prepareContentParams(prompt, selectedModel.name);
			const resp = await executeFuncAndGetUniqueId({
				method: "POST",
				data: {
					prompt,
					engine: selectedModel.name,
					is_priority: true,
					link
				},
				url: "/ai/generate_content"
			});
			if (resp.error) throw resp;
			if (!resp.data) throw new Error("No data found");
			const result = await pollRequest<PollParams, GeneratedContentProps>({
				data: { id: resp.data.id },
				method: "POST",
				url: "/ai/retrieve_transcript",
				callback: (data) => {
					// setPolling(false);
					// onResult(data.content);
				},
				errorCallback: () => {
					// AlertErrorMessage({ text: "Content generation failed, Please try again later" });
					// setPolling(false);
				}
			});
			onResult(result);
			setSaving(false);
		} catch (err) {
			console.error(err);
			AlertErrorMessage({ text: "Content generation failed, Please try again later" });
			setSaving(false);
		}
		// setSaving(false);
	};

	if (loading) {
		return <div className="flex items-center justify-center">
			<div className="flex items-center flex-col">
				<Spinner size="xs" />
				<span className="mt-2 text-gray-600">Fetching keywords...</span>
			</div>
		</div>;
	}
	if (!keywords || keywords.length <= 0) {
		return <Typography
			variant="div"
			font={16}
			weight="regular"
			className="italic"
		>
        No data available
		</Typography>;
	}
	return (
		<>
			{keywords.map((item, i) => (
				<Keyword item={item} key={"keyword_" + i} idx={i + 1} handleClick={(val) => {
					if (!selectedkeywords.includes(val)) {
						const res = clone<string[]>(selectedkeywords);
						res.push(val);
						setSelectedKeywords(res);
					}
				}} 
				selectedKeywords={selectedkeywords}
				/>
			))}
			<form className="" onSubmit={handleSubmit}>
				<div className="flex inline gap-1 flex-wrap">
					{selectedkeywords.map((keyword, i) => (
						<div className="bg-blue-100 px-2 py-1 rounded" key={"keyword_selected_" + i}>
							{keyword} <span className="text-red-600 cursor-pointer"
								onClick={() => {
									const res = clone<string[]>(selectedkeywords);
									res.splice(i, 1);
									setSelectedKeywords(res);
								}}
							>&times;</span>
						</div>
					))}
					{selectedkeywords.length <= 0 && (
						<Typography
							font={14}
							variant="span"
							weight="regular"
							className="text-slate-400"
						>
                            Add up to {MAX_ALLOWED_KEYWORDS} keywords to generate content
						</Typography>
					)}
				</div>
				<div>
					<TextareaInput 
						value={text}
						name="prompt"
						onChange={(e) => setText(e.target.value)}
						placeholder="Enter a prompt (100 words using these keywords)"
						className="w-full mt-3 h-28"
					/>
				</div>
				<Button
					type="submit"
					className="mt-3 flex items-center"
					disabled={saving || polling || selectedkeywords.length <= 0}
				>
					{saving ? "Generating..." : "Generate content"}
					{saving && <Spinner size="xxs" className="ml-2" />}
				</Button>
			</form>
		</>
	);
}
