import { TestTranscriptData } from "@customTypes/Ai";
import Button from "components/Commons/ Button/Button";
import CollapsibleContent from "components/Commons/CollapsibleContent";
import Typography from "components/Commons/Typography/Typography";
import React from "react";

interface Props {
  item: TestTranscriptData;
  i: number;
}
export default function EachTestTranscript({ item, i }: Props) {
	const models = [
		"assembly_ai",
		"deepgram_base",
		"deepgram_enhanced",
		"deepgram_nova",
	];
	return (
		<div className="border-b mt-3">
			<Typography variant="span" font={16} weight="regular">
				{i + 1}) Inspired by{" "}
				<a
					className="underline text-blue-600 hover:pointer"
					href={item.args.link}
					target={"_blank"}
					rel="noreferrer"
				>
					{item.args.link}
				</a>{" "}
				<a
					className="bg-gray-200 mx-2 px-3 py-1 rounded hover:cursor-pointer"
					target={"_blank"}
					href={`/content/${item.id}`}
					rel="noreferrer"
				>
          New Tab
				</a>
			</Typography>
			<div className="grid grid-cols-2 gap-4 my-3">
				{models.map((key) => {
					const content =
            item.content[key as keyof TestTranscriptData["content"]];
					if (!content) return;
					return (
						<div
							key={"model_" + key + "_" + item.id}
							className="col-2 md:col-1"
						>
							<Typography
								variant="span"
								className="bg-gray-200 px-3 py-2 underline"
								weight="medium"
								font={14}
							>
								{key}
							</Typography>
							<CollapsibleContent content={content.transcript} />
						</div>
					);
				})}
			</div>
		</div>
	);
}
