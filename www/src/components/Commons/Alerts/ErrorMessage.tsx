import React from "react";
import Typography from "../Typography/Typography";

export default function ErrorMessage({ error }: { error: string }) {
	return (
		<Typography
			variant="div"
			weight="regular"
			font={16}
			className="text-red-500 italic"
		>
			{error}
		</Typography>
	);
}
