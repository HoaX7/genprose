import clsx from "clsx";
import Typography from "components/Commons/Typography/Typography";
import { PERSONAS } from "helpers/constants";
import React from "react";

type T = {
    persona: string;
    tone: string;
}
interface Props {
    selected: T;
    setSelected: (val: T) => void;
}
export default function PersonasIndex({ selected, setSelected }: Props) {
	return (
		<div className='grid grid-cols-6 gap-4 mt-3'>
			{PERSONAS.map((persona) => (
				<Typography
					variant="div"
					font={14}
					weight="regular"
					key={"persona_" + persona.key}
					onClick={(e) => {
						setSelected({
							...selected,
							persona: persona.name,
						});
					}}
					className={clsx(
						"cursor-pointer col-span-3 md:col-span-2 border rounded h-12",
						"flex items-center justify-center",
						selected.persona === persona.name
							? "border-site-purple border-2"
							: ""
					)}
				>
					{persona.name}
				</Typography>
			))}
		</div>
	);
}
