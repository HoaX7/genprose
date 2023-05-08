import Typography from "components/Commons/Typography/Typography";
import { LOADING_FACTS } from "helpers/constants";
import React from "react";

export default function FactsSlider() {
	return (
		<div className="mt-3">
			<Typography
				font={14}
				weight="regular"
				variant="div"
				className="text-indigo-600"
			>
                Did you know?
			</Typography>
			<Typography
				weight="medium"
				font={16}
				variant="div"
			>
				{LOADING_FACTS[0]}
			</Typography>
		</div>
	);
}
