import clsx from "clsx";
import Typography from "components/Commons/Typography/Typography";
import { TONES } from "helpers/constants";
import React from "react";

type T = {
    persona: string;
    tone: string;
}
interface Props {
    selected: T;
    setSelected: (val: T) => void;
}
export default function TonesIndex({ selected, setSelected }: Props) {
	return (
		<div className="grid grid-cols-6 gap-4 mt-3">
			{TONES.map((tone) => (
				<Typography
					variant="div"
					font={14}
					weight="regular"
					key={"tone_" + tone.key}
					onClick={(e) => {
						setSelected({
							...selected,
							tone: tone.name,
						});
					}}
					className={clsx(
						"relative cursor-pointer col-span-3 md:col-span-2 border rounded h-12",
						"flex items-center justify-center",
						selected.tone === tone.name ? "border-site-purple border-2" : ""
					)}
				>
					<Typography
						font={10}
						weight="regular"
						variant="span"
						className="absolute left-1 top-1"
					>
                Tone
					</Typography>
					{tone.name}
				</Typography>
			))}
		</div>
	);
}
