import { ContentProps, Metadata } from "@customTypes/Ai";
import clsx from "clsx";
import Button from "components/Commons/ Button/Button";
import SuccessTicketIcon from "components/Commons/StatusMenu/SuccessTicketIcon";
import Typography from "components/Commons/Typography/Typography";
import { pollRequest } from "helpers/pollRequest";
import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import {
	CONTENT_TYPES,
	PERSONAS,
	STEPPER_KEYS,
	TONES,
} from "helpers/constants";
import ShowContent from "./ShowContent";
import Feedback from "../Feedback/index";
import { CopySvg } from "components/Commons/Svg";
import { FontSize } from "@customTypes/Typography";
import ConfettiExplosion from "react-confetti-explosion";
import Status from "./Status";

interface Props {
  result?: ContentProps;
  setMetadata: (props: Metadata) => void;
}
export default function ContentIndex({ result, setMetadata }: Props) {
	const [ _result, setResult ] = useState(result);
	const [ error, setError ] = useState("");
	const [ loading, setLoading ] = useState(true);
	const [ isURLCopied, setIsURLCopied ] = useState(false);
	const [ isExploding, setIsExploding ] = useState(false);

	const [ generatedContents, setGeneratedContents ] = useState(
		result?.content || []
	);

	const clipboardTimeout: any = useRef();

	useEffect(() => {
		(async () => {
			try {
				if (!result?.id || result.status === "COMPLETED") {
					setLoading(false);
					setIsExploding(true);
					return;
				}
				const resp = await pollRequest({
					url: "ai/preview_transcript",
					method: "GET",
					data: { id: result.id },
					errorCallback: (error) => setError(error),
					onProgress: (data) => {
						if (
							data.content_type === CONTENT_TYPES.EXTRACT_CONTENT &&
	          !_result?.transcript
						) {
							if (data.content) {
								setGeneratedContents(data.content);
							}
							setResult(data);
							// setLoading(false);
						}
					},
				});
				if (!resp) throw resp;
				setMetadata({
					stepper: [
						STEPPER_KEYS.AUDIO_FILE,
						STEPPER_KEYS.PERSONA,
						STEPPER_KEYS.GENERATE_CONTENT,
					],
				});
				setGeneratedContents(resp.content || []);
				setResult(resp);
				setIsExploding(true);
			} catch (err: any) {
				setError(err.message || "Unable to fetch data, try again later.");
			}
			setLoading(false);
		})();
	}, []);

	const CopyUrlBtn = ({ fontSize = 14 }: { fontSize: FontSize }) => (
		<Button
			font={fontSize}
			weight="bold"
			variant="span"
			type="button"
			className="mt-3"
			onClick={(e) => {
				e.preventDefault();
				navigator.clipboard.writeText(window.location.href);
				setIsURLCopied(true);
			}}
		>
			{isURLCopied ? (
				<>
          Copied <SuccessTicketIcon className="accent-indigo-600 ml-2" />
				</>
			) : (
				<>
          Copy URL
					<CopySvg fill="#fff" className="inline ml-2" width={16} />
				</>
			)}
		</Button>
	);

	useEffect(() => {
		if (isURLCopied) {
			clipboardTimeout.current = setTimeout(() => {
				setIsURLCopied(false);
			}, 2000);
		}
		return () => clearTimeout(clipboardTimeout.current);
	}, [ isURLCopied ]);

	return (
		<div className="mt-3">
			{isExploding && result?.id && (
				<div className="flex justify-center items-center absolute left-0 right-0">
					<ConfettiExplosion onComplete={() => setIsExploding(false)} />
				</div>
			)}
			{result?.id && loading === false && (
				<div className="fixed bottom-5 left-0 right-0 text-center">
					<div className="flex flex-col">
						<Typography
							variant="span"
							font={12}
							weight="regular"
							className="text-indigo-600"
						>
              Not satisfied?
						</Typography>
						<div>
							<Button
								onClick={() => {
									setMetadata({ stepper: [ STEPPER_KEYS.AUDIO_FILE ] });
									Router.push({
										pathname: `/persona/${result.id}`,
										query: {
											persona: result.args.persona || PERSONAS[0].name,
											tone: result.args.tone || TONES[0].name,
										},
									});
								}}
								className="shadow-lg"
								font={18}
								weight="bold"
								variant="div"
							>
                Regenerate{" "}
								<img
									src="../assets/images/retry.svg"
									width={18}
									className="inline ml-2"
								/>
							</Button>
						</div>
					</div>
				</div>
			)}
			{_result?.id && (
				<>
					<div
						className={clsx(
							"grid grid-cols-5 gap-4",
							"bg-site-secondary-transparent md:bg-none rounded-xl p-3"
						)}
					>
						<Typography
							variant="div"
							className="col-span-5 md:col-span-2"
							weight="medium"
							font={16}
						>
							{loading === true && !_result?.args.title ? (
								<div className="animate-pulse w-60 h-6 rounded-[63px] bg-gray-300"></div>
							) : (
								_result?.args.title
							)}
							<div>
								<small>
									<a
										className="underline text-indigo-600 cursor-pointer"
										href={_result.args.link}
										target={"_blank"}
										rel="noreferrer"
									>
                    Video link
									</a>
								</small>
							</div>
						</Typography>
						<Typography
							variant="div"
							className="col-span-5 md:col-span-2 text-indigo-600"
							weight="medium"
							font={16}
						>
							{_result?.args.persona || "Content Creator"} /{" "}
							{_result?.args.tone || "Passive"}
						</Typography>
						{loading === false && (
							<div className="col-span-5 -mt-3 text-end md:col-span-1 hidden md:block">
								<CopyUrlBtn fontSize={12} />
							</div>
						)}
					</div>
				</>
			)}
			{(loading === true || !_result?.id || _result.status === "ERROR") && (
				<Status
					loading={loading}
					renderBtn={() => <CopyUrlBtn fontSize={18} />}
				/>
			)}
			{loading === false && _result?.id && generatedContents.length > 0 && (
				<div className="grid grid-cols-6 gap-4 mt-5">
					<div className="col-span-6 md:col-span-4">
						<ShowContent result={generatedContents} />
					</div>
					<div className="col-span-6 md:col-span-2">
						<Feedback onExplodeConfetti={() => setIsExploding(true)} />
					</div>
				</div>
			)}
		</div>
	);
}
