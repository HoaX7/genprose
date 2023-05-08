import { ContentProps } from "@customTypes/Ai";
import { getContentById } from "api/ai";
import Error from "components/Commons/Error";
import PersonaIndex from "components/Persona";
import { PERSONAS, TONES } from "helpers/constants";
import { GetServerSideProps } from "next";
import React from "react";

interface Props {
  error?: boolean;
  result?: ContentProps;
}
export default function PersonaId({ error, result }: Props) {
	return (
		<div className="container mx-auto p-3">
			{(error || !result?.id) && <Error />}
			{!error && result?.id && (
				<PersonaIndex
					link={result.args.link || ""}
					persona={result.args.persona || PERSONAS[0].name}
					tone={result.args.tone || TONES[0].name}
					keywords={result.keywords}
					id={result.id}
				/>
			)}
		</div>
	);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	try {
		let id = ctx.params?.id;
		if (!id) return { props: { error: true } };
		if (typeof id === "object") {
			id = id[0];
		}
		const result = await getContentById({ id });
		return { props: { result: result.data } };
	} catch (err) {
		console.error("Persona.id.getServerSideProps: Failed", err);
		return { props: { error: true } };
	}
};
