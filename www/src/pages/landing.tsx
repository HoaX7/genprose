import clsx from "clsx";
import Button from "components/Commons/Button/Button";
import Typography from "components/Commons/Typography/Typography";
import React, { useState } from "react";
import Input from "components/Commons/Input/TextInput";
import ConfettiExplosion from "react-confetti-explosion";
import { AlertErrorMessage, AlertMessage } from "components/Commons/Alerts";
import Spinner from "components/Commons/Loaders/Spinner";
import { signupApi } from "api/auth";

const content = [
	{
		key: "section1",
		name: "Paste your YouTube link",
		description:
      "Seamlessly paste your YouTube links, select your desired persona and tone, " +
      "and watch as our AI models work their magic. " +
      "Regenerate and fine-tune the content until it aligns perfectly with your vision.",
		gif: "gif1",
	},
	{
		key: "section2",
		name: "Choose your Persona and Tone",
		description:
      "Our innovative platform allows you to choose a persona and tone for your articles, " +
      "ensuring that every piece reflects your brand's unique personality. " +
      "Whether you're aiming for an authoritative voice or a friendly " +
      "conversational tone, genprose has got you covered.",
		gif: "gif2",
	},
];

export default function landing() {
	const [ email, setEmail ] = useState("");
	const [ isExploding, setIsExploding ] = useState(false);
	const [ saving, setSaving ] = useState(false);

	const renderContent = (name: string, description: string) => {
		return (
			<>
				<Typography
					font={30}
					weight="medium"
					variant="h2"
					className="!font-24 md:!font-30"
				>
					{name}
				</Typography>
				<Typography
					weight="regular"
					variant="p"
					font={24}
					className="mt-5 !font-18 md:!font-24"
				>
					{description}
				</Typography>
			</>
		);
	};

	return (
		<div className="bg-site-gradient text-white">
			<div className="container p-10 mx-auto">
				<div className="md:mt-32 mt-10 grid grid-cols-3 gap-4">
					<div className="col-span-3 md:col-span-2">
						<Typography
							weight="medium"
							variant="h1"
							font={36}
							className="!font-30 md:!font-36"
						>
							<img
								src="../assets/images/logo-white-img.png"
								width={42}
								alt="genprose"
								className="inline"
								loading="eager"
							/>{" "}
              Gen Prose
						</Typography>
						<Typography
							variant="p"
							font={24}
							weight="regular"
							className="mt-5 !font-18 md:!font-24"
						>
              Effortlessly convert your audio files into captivating articles
              that resonate with your target audience. Say goodbye to tedious
              transcription and manual content creation. Our advanced AI
              algorithms extract valuable transcripts and keywords, transforming
              them into compelling written content that captures the essence of
              your message.
						</Typography>
						<Button
							variant="div"
							font={20}
							weight="medium"
							className="mt-5 !font-18 md:!font-20"
						>
							<a href="#footer">Join the waitlist</a>
						</Button>
					</div>
					<div className="col-span-3 md:col-span-1">
						<div
							className={clsx(
								"bg-site shadow rounded-md text-black w-full",
								"flex flex-col items-center justify-center opacity-50",
								"h-40 md:h-full"
							)}
						>
							<img
								alt="video"
								src={"../assets/images/youtube.svg"}
								width={48}
							/>
							<Typography font={18} weight="bold" variant="div">
                Video Coming Soon
							</Typography>
						</div>
					</div>
				</div>
			</div>
			<div className="text-black bg-site">
				<div className="container p-3 mx-auto">
					{content.map(({ name, key, description, gif }, i) => (
						<section
							key={key}
							id={key}
							className="my-24 bg-site-secondary-transparent p-10 rounded-lg shadow"
						>
							<div className="grid grid-cols-3 gap-4">
								<div
									className={clsx(
										i % 2 === 0 ? "md:col-span-2" : "md:col-span-1",
										"col-span-3"
									)}
								>
									{i % 2 === 0 ? (
										renderContent(name, description)
									) : (
										<img
											alt={key}
											width={500}
											src={`../assets/images/${gif}.gif`}
											className="rounded-md shadow"
										/>
									)}
								</div>
								<div
									className={clsx(
										i % 2 === 0 ? "md:col-span-1" : "md:col-span-2",
										"col-span-3"
									)}
								>
									{i % 2 === 0 ? (
										<img
											alt={key}
											width={500}
											src={`../assets/images/${gif}.gif`}
											className="rounded-md shadow"
										/>
									) : (
										renderContent(name, description)
									)}
								</div>
							</div>
						</section>
					))}
				</div>
			</div>
			<section className="bg-[#ecf3ff] text-black" id="footer">
				{isExploding && (
					<div className="flex justify-center">
						<ConfettiExplosion onComplete={() => setIsExploding(false)} />
					</div>
				)}
				<div className="container p-10 mx-auto">
					<Typography
						font={30}
						weight="medium"
						variant="h2"
						className="!font-24 md:!font-30"
					>
            Unleash the Power of Audio-to-Content Generation!
					</Typography>
					<Typography
						variant="p"
						font={24}
						weight="regular"
						className="mt-5 !font-18 md:!font-24"
					>
            Join us on this exciting journey as we revolutionize content
            creation. Sign up below to be the first to know when{" "}
						<strong className="text-indigo-600">Gen Prose</strong> officially
            launches. Get ready to unlock a new world of convenience,
            creativity, and efficiency.
					</Typography>
					<form
						className="md:w-2/5 mt-5 p-2 flex border-4 rounded-xl"
						onSubmit={async (e) => {
							e.preventDefault();
							try {
								setSaving(true);
								await signupApi({ email });
								setEmail("");
								setIsExploding(true);
								AlertMessage({
									text:
                    "You are all set to get early access. " +
                    "You will receive an email when it is your turn.",
									title: "Success",
								});
							} catch (err: any) {
								console.error("Failed to signup new user: ", email);
								console.error(err);
								AlertErrorMessage({
									text:
                    err?.message ||
                    "Something went wrong. Please try again later.",
								});
							}
							setSaving(false);
						}}
					>
						<label className="sr-only">email</label>
						<Input
							placeholder="Email"
							className="border-none w-full !font-18"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type={"email"}
							pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
						/>
						<Button
							variant="div"
							font={20}
							weight="medium"
							type="submit"
							className="!font-14 md:!font-16"
							disabled={!email || saving}
						>
							{saving ? (
								<>
									<Spinner size="xxs" />
								</>
							) : (
								"Submit"
							)}
						</Button>
					</form>
					<Typography
						variant="div"
						font={18}
						className="mt-5 !font-16 md:!font-18"
						weight="medium"
					>
            © Genprose, 2023. All rights reserved.
					</Typography>
				</div>
			</section>
		</div>
	);
}
