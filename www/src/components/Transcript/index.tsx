import { Metadata } from "@customTypes/Ai";
import Typography from "components/Commons/Typography/Typography";
import React from "react";
import Extractors from "./Extractors";

interface Props {
	setMetadata: (props: Metadata) => void;
}
export default function TranscriptIndex({ setMetadata }: Props) {
	return (
		<div className="mt-10">
			<Typography
				variant="div"
				className="mt-3 mx-auto w-full md:w-9/12 lg:w-5/12 text-center"
				weight="medium"
				font={16}
			>
        Access our speech-to-text AI models to extract transcript and generate
        SEO ready content using prompts and keywords. Quickly test below using
        any YouTube link.
			</Typography>
			<Extractors setMetadata={setMetadata} />
		</div>
	);
}
