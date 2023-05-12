import clsx from "clsx";
import React, { useState } from "react";
import Input from "components/Commons/Input/TextInput";
import Typography from "components/Commons/Typography/Typography";
import Button from "components/Commons/ Button/Button";
import { AlertErrorMessage } from "components/Commons/Alerts";
import { executeFuncAndGetUniqueId, generateContent } from "api/ai";
import Router from "next/router";
import Spinner from "components/Commons/Loaders/Spinner";
import Personas from "./Personas";
import Tones from "./Tones";
import ShowKeywords from "components/Content/ShowKeywords";
import { getPrompt } from "helpers/prompting";
import { connectStore } from "store/WithContext";
import { setMetadata } from "store/actionCreators";
import { Metadata } from "@customTypes/Ai";
import { PERSONAS, STEPPER_KEYS, TONES } from "helpers/constants";

const con = connectStore((state, dispatch) => ({ setMetadata: (props) => setMetadata(props)(dispatch), }));

interface Props {
  link: string;
  persona?: string;
  tone?: string;
  keywords?: string[];
  id?: string;
  setMetadata: (props: Metadata) => void;
}

function PersonaIndex({
	link,
	persona,
	tone,
	keywords,
	id,
	setMetadata,
}: Props) {
	const [ selected, setSelected ] = useState({
		persona: persona || PERSONAS[0].name,
		tone: tone || TONES[0].name,
	});
	const [ saving, setSaving ] = useState(false);
	const [ selectedKeywords, setSelectedKeywords ] = useState(keywords || []);
	const [ showTip, setShowTip ] = useState(false);

	const handleGenerateArticle = async () => {
		try {
			const result = await executeFuncAndGetUniqueId({
				method: "POST",
				url: "/ai/transcribe",
				data: {
					url: link,
					persona: selected.persona,
					tone: selected.tone,
				},
			});
			if (result.error) throw result;
			const contentId = result.data?.id;
			setSaving(false);
			setMetadata({ stepper: [ STEPPER_KEYS.AUDIO_FILE, STEPPER_KEYS.PERSONA ] });
			Router.push(`content/${contentId}`);
		} catch (err) {
			setSaving(false);
			console.error("Persona.index.handleGenerateArticle: Failed", err);
			AlertErrorMessage({ text: "Unable to generate content. Please try again.", });
		}
	};

	const handleRegenerateArticle = async () => {
		try {
			if (!id) {
				AlertErrorMessage({ text: "Something went wrong. Please try again." });
				return;
			}
			if (selectedKeywords.length < 5) {
				AlertErrorMessage({ text: "Please select atleast 5 keywords" });
				return;
			}
			await generateContent({
				is_priority: true,
				id,
				prompt: getPrompt(selectedKeywords, selected.persona, selected.tone),
				persona: selected.persona,
				tone: selected.tone,
			});
			setSaving(false);
			setMetadata({ stepper: [ STEPPER_KEYS.AUDIO_FILE, STEPPER_KEYS.PERSONA ] });
			Router.push(`/content/${id}`);
		} catch (err: any) {
			setSaving(false);
			console.error("Persona.index.handleRegenerateArticle: Failed", err);
			AlertErrorMessage({ text: err?.message || "Unable to generate content. Please try again.", });
		}
	};

	return (
		<div
			className={clsx(
				"mx-auto mt-10 text-center",
				"w-full md:w-9/12 lg:w-5/12 "
			)}
		>
			<div className="pb-3 border-b border-gray-100">
				<Typography weight="medium" font={16} variant="div">
          Your YouTube video link
				</Typography>
				<Input
					placeholder={link}
					readOnly={true}
					className="bg-gray-200 w-full mt-3"
					disabled={true}
				/>
			</div>
			{keywords && keywords.length > 0 && (
				<div className="pb-3 border-b border-gray-100 mt-3">
					<ShowKeywords
						result={keywords}
						selectedKeywords={selectedKeywords}
						setSelectedKeywords={setSelectedKeywords}
					/>
				</div>
			)}
			<div className="mt-3">
				<Typography variant="div" font={16} weight="medium" className="mt-3 relative">
          Choose Persona / Tone{" "}
					<img
						alt="info"
						src={"../assets/images/info.svg"}
						width={18}
						className="inline cursor-pointer"
						onMouseLeave={() => {
							if (showTip) setShowTip(false);
						}}
						onMouseEnter={() => {
							if (!showTip) setShowTip(true);
						}}
					/>
					<dialog
						open={showTip}
						className={clsx("absolute bg-site -top-24",
							"rounded-lg z-10 shadow text-gray-600",
							"text-start", "w-auto md:w-3/5 md:left-2/3")}
					>
						<Typography variant="div" weight="regular" font={14} 
							className="flex items-center">
							<img
								alt="info"
								src={"../assets/images/info.svg"}
								width={14}
								className="mr-1"
							/>	info
						</Typography>
						<Typography
							variant="p"
							weight="regular"
							font={16}
						>
							The persona / tone indicates from what point of view the content is written.
						</Typography>
					</dialog>
				</Typography>
				<Personas selected={selected} setSelected={setSelected} />
				<Tones selected={selected} setSelected={setSelected} />
				<Button
					type="button"
					className="mt-10 shadow-lg"
					onClick={() => {
						setSaving(true);
						if (id) {
							handleRegenerateArticle();
						} else {
							handleGenerateArticle();
						}
					}}
					disabled={
						saving || (id && selectedKeywords.length < 5) ? true : false
					}
					variant="div"
					weight="bold"
					font={18}
				>
					{saving ? (
						<span className="flex items-center">
							<Spinner size="xxs" className="mr-2" />
              Generating...
						</span>
					) : (
						"Generate Article"
					)}
				</Button>
			</div>
		</div>
	);
}

export default con(PersonaIndex);
