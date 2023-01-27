import React, { useState } from "react";
import { GeneratedContentProps, TranscriptKeywordProps } from "../../@customTypes/Ai";
import Typography from "../Commons/Typography/Typography";
import Input from "../Commons/Input/TextInput";
import Button from "../Commons/ Button/Button";
import { AlertErrorMessage } from "../Commons/Alerts";
import { getContentFromKeywords } from "../../api/ai";
import Spinner from "../Commons/Loaders/Spinner";

interface K {
    item: string[];
    idx: number;
    onResult: (data: GeneratedContentProps) => void;
}
const Keyword = ({ item, idx, onResult }: K) => {
	const [ text, setText ] = useState("");
	const [ saving, setSaving ] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		try {
			e.preventDefault();
			if (!text) return;
			setSaving(true);
			const prompt = text + " using keywords " + item.join(", ");
			const result = await getContentFromKeywords({ prompt });
			if (result.error) throw result;
			if (result.data) onResult(result.data);
		} catch (err) {
			console.error(err);
			AlertErrorMessage({ text: "Unable to generate content" });
		}
		setSaving(false);
	};
	return (
		<div className='mb-3 rounded'>
			{idx}# {item.join(", ")}
			<form className="" onSubmit={handleSubmit}>
				<div>
					<Input 
						value={text}
						name="prompt"
						onChange={(e) => setText(e.target.value)}
						placeholder="Enter a prompt (100 words using these keywords)"
						className="w-full mt-3"
					/>
				</div>
				<Button
					type="submit"
					className="mt-3 flex items-center"
					disabled={saving || !text}
				>
					{saving ? "Generating..." : "Generate content"}
					{saving && <Spinner size="xxs" className="ml-2" />}
				</Button>
			</form>
		</div>
	);
};

interface P {
    keywords: TranscriptKeywordProps["keywords"];
    onResult: (data: GeneratedContentProps) => void;
}
export default function GeneratedKeywords({ keywords = [], onResult }: P) {
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
				<Keyword item={item} key={"keyword_" + i} idx={i + 1} onResult={onResult} />
			))}
		</>
	);
}
