import clsx from "clsx";
import Button from "components/Commons/Button/Button";
import Typography from "components/Commons/Typography/Typography";
import { clone } from "helpers";
import React, { useState } from "react";

interface Props {
  result: string[];
  selectedKeywords: string[];
  setSelectedKeywords: (kw: string[]) => void;
}
export default function ShowKeywords({ result, selectedKeywords, setSelectedKeywords }: Props) {
	const [ isOpen, setIsOpen ] = useState(true);
	return (
		<div>
			<Typography
				variant="div"
				weight="medium"
				font={16}
				className="cursor-pointer"
				onClick={() => setIsOpen(!isOpen)}
			>
        Keywords ({selectedKeywords.length}){" "}
				<img
					src="/assets/images/caret.svg"
					width={16}
					className={clsx(
						isOpen ? "rotate-90" : "-rotate-90",
						"ease-in-out transition duration-300",
						"inline"
					)}
				/>
			</Typography>
			<Typography
				variant="div"
				weight="regular"
				font={16}
				className="text-gray-500 opacity-75 mt-3"
			>
                    Select atleast 5 keywords to generate content
			</Typography>
			{isOpen && (
				<div>
					<div className="flex items-center justify-start">
						<Button
							className={clsx("!bg-transparent !text-indigo-600",
								"hover:!bg-indigo-600/[.08] rounded-md")}
							disabled={selectedKeywords.length >= result.length}
							onClick={() => setSelectedKeywords(result)}
							weight="medium"
							font={12}
							variant="span"
						>
                            Select all
						</Button>
						<Button 
							className={clsx("!bg-transparent !text-indigo-600",
								"hover:!bg-indigo-600/[.08] rounded-md")}
							disabled={selectedKeywords.length <= 0}
							onClick={() => setSelectedKeywords([])}
							weight="medium"
							font={12}
							variant="span"
						>
                            Deselect all
						</Button>
					</div>
					<div className="grid grid-cols-6 gap-4 mt-3 h-36 overflow-auto">
						{result.map((item, i) => (
							<>
								<Typography
									key={"keyword_" + i}
									variant="div"
									weight="regular"
									font={14}
									className={clsx("col-span-3 md:col-span-2 capitalize h-12 border rounded",
										"flex items-center justify-center cursor-pointer",
										selectedKeywords.includes(item) ? "border-site-purple border-2" : "")}
									onClick={() => {
										const res: string[] = clone(selectedKeywords);
										const idx = res.findIndex((r) => r === item);
										if (idx >= 0) {
											res.splice(idx, 1);
										} else {
											res.push(item);
										}
										setSelectedKeywords(res);
									}}
								>
									{item}
								</Typography>
							</>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
