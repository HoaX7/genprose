import Button from "components/Commons/ Button/Button";
import Typography from "components/Commons/Typography/Typography";
import React from "react";
import Router from "next/router";
import AudioWaveLoader from "components/Commons/Loaders/AudioWaveLoader";
import FactsSlider from "./FactsSlider";
import clsx from "clsx";

interface Props {
    loading?: boolean;
    renderBtn: () => React.ReactElement;
}
export default function Status({ loading, renderBtn }: Props) {
	const LoadingText = () => {
		return (
			<>
				<div className="flex justify-center">
					<AudioWaveLoader />
				</div>
				<FactsSlider />
				<Typography
					variant="p"
					weight="regular"
					font={14}
					className="text-gray-500 mt-3"
				>
          Processing time takes roughly about 20-30% of the video&#39;s
          duration. For example, a 10 minute video takes 90-180 seconds to
          complete. We will email you when your content is ready. You can also
          copy the URL and come back to it later.
				</Typography>
				<div className="mt-2">
					{renderBtn()}
				</div>
			</>
		);
	};

	const ErrorText = () => {
		return (
			<>
				<Typography weight="medium" font={16} variant="div">
          Something went wrong
				</Typography>
				<Typography
					variant="p"
					weight="regular"
					font={14}
					className="text-gray-500"
				>
          We could not process your request. Please try again.
				</Typography>
				<Button
					type="button"
					className="mt-3"
					onClick={(e) => {
						e.preventDefault();
						Router.push("/");
					}}
					font={18}
					weight="bold"
					variant="span"
				>
          Retry
				</Button>
			</>
		);
	};
	return (
		<div
			className={clsx(
				"mx-auto mt-32",
				"w-full md:w-9/12 lg:w-5/12 text-center"
			)}
		>
			{loading === true ? <LoadingText /> : <ErrorText />}
		</div>
	);
}
