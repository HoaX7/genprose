import React, { useState } from "react";
import { GeneratedContentProps, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import TextareaInput from "../Commons/Input/TextareaInput";
import Button from "../Commons/ Button/Button";
import { AlertErrorMessage } from "../Commons/Alerts";
import { getContentFromKeywords } from "../../api/ai";
import Spinner from "../Commons/Loaders/Spinner";
import clsx from "clsx";
import { AI_MODEL_ENGINES, MAX_ALLOWED_KEYWORDS } from "../../helpers/constants";

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
    onResult: (data: GeneratedContentProps) => void;
    selectedModel: typeof AI_MODEL_ENGINES[""];
}
export default function GeneratedKeywords({ keywords = [], onResult, selectedModel }: P) {
	const [ selectedkeywords, setSelectedKeywords ] = useState<string[]>([]);
	const [ saving, setSaving ] = useState(false);
	const [ text, setText ] = useState("Generate 100 words using these keywords");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (!text) return;
			setSaving(true);
			const prompt = text + " using keywords " + selectedkeywords.join(", ");
			const result = await getContentFromKeywords({ prompt }, selectedModel.name);
			if (result.error) throw result;
			if (result.data) onResult(result.data);
		} catch (err) {
			console.error(err);
			AlertErrorMessage({ text: "Unable to generate content" });
		}
		setSaving(false);
	};

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
						const res = structuredClone(selectedkeywords);
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
									const res = structuredClone(selectedkeywords);
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
					disabled={saving || selectedkeywords.length <= 0}
				>
					{saving ? "Generating..." : "Generate content"}
					{saving && <Spinner size="xxs" className="ml-2" />}
				</Button>
			</form>
		</>
	);
}
