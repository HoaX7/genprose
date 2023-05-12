import clsx from "clsx";
import Button from "components/Commons/Button/Button";
import { AlertErrorMessage } from "components/Commons/Alerts";
import Typography from "components/Commons/Typography/Typography";
import React, { useState } from "react";
import Input from "../Commons/Input/TextInput";
import Router from "next/router";
import { Metadata } from "@customTypes/Ai";
import { STEPPER_KEYS } from "helpers/constants";

interface Props {
	setMetadata: (props: Metadata) => void;
}
export default function Extractors({  setMetadata }: Props) {
	const [ url, setUrl ] = useState("");

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			if (!url) return;
			// const result = await executeFuncAndGetUniqueId({
			// 	method: "POST",
			// 	url: "/ai/transcribe",
			// 	data: { url }
			// });
			// if (result.error) throw result;
			// const id = result.data?.id;
			// Router.push(`content/${id}`);
			setMetadata({ stepper: [ STEPPER_KEYS.AUDIO_FILE ] });
			Router.push({
				pathname: "persona",
				query: { link: url }
			}, undefined, { shallow: true });
		} catch (err: any) {
			AlertErrorMessage({ text: err?.message || "Unable to Transcribe audio. Please try again later." });
		}
		return;
	};

	return (
		<form className={clsx("mx-auto mt-3",
			"w-full md:w-9/12 lg:w-5/12 ")} onSubmit={handleSubmit}>
			<div className="rounded-xl border p-5 w-full">
				<label>
					<Typography variant="div" font={16} weight="medium" className="mx-2">
						<img src="/assets/images/youtube.svg" 
							alt="yt"
							width={24}
							className="inline mr-2"
						/> YouTube video link
					</Typography>
				</label>
				<Input
					type={"text"}
					placeholder="https://youtube.com/watch?v=wx1u..."
					className={clsx("border-none w-full text-gray-700")}
					onChange={(e) => setUrl(e.target.value)}
				/>
			</div>
			<div className="rounded-xl border p-5 w-full mt-3 cursor-pointer">
				<Typography variant="div" font={16} weight="medium" className="mx-2">
					<img src="/assets/images/podcast.svg" 
						alt="yt"
						width={22}
						className="inline mr-2"
					/> Podcast audio link
				</Typography>
				<Typography
					font={14}
					weight="regular"
					variant="div"
					className="text-gray-400 mx-3 mt-1"
				>
						Enter a podcast audio link
				</Typography>
			</div>
			<div className="rounded-xl border p-5 w-full mt-3 cursor-pointer">
				<Typography variant="div" font={16} weight="medium" className="mx-2">
					<img src="/assets/images/audio.svg" 
						alt="yt"
						width={24}
						className="inline mr-2"
					/> Audio file
				</Typography>
				<Typography
					font={14}
					weight="regular"
					variant="div"
					className="text-gray-400 mx-3 mt-1"
				>
						Upload a podcast, phone call or meeting audio file.
				</Typography>
			</div>
			<div className="rounded-xl border p-5 w-full mt-3 cursor-pointer">
				<Typography variant="div" font={16} weight="medium" className="mx-2">
					<img src="/assets/images/microphone.svg" 
						alt="yt"
						width={24}
						className="inline mr-2"
					/> Record
				</Typography>
				<Typography
					font={14}
					weight="regular"
					variant="div"
					className="text-gray-400 mx-3 mt-1"
				>
						Speak into your browser mic.
				</Typography>
			</div>
			<Typography
				variant="div"
				weight="regular"
				font={14}
				className="mt-3 text-gray-500"
			>
        Don&#39;t have an YouTube link or audio file on hand?{" "}
				<a className="text-blue-600 hover:cursor-pointer hover:underline">
          View sample result &gt;
				</a>
			</Typography>
			<div className="mt-5 flex justify-center">
				<Button
					type="submit"
					disabled={!url}
					variant="div"
					weight="bold"
					font={18}
					className="shadow-lg"
				>
                Submit
				</Button>
			</div>
		</form>
	);
}
