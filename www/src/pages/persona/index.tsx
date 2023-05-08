import Error from "components/Commons/Error";
import PersonaIndex from "components/Persona";
import { NextPage } from "next";
import React from "react";

interface Props {
    link?: string;
}
const Persona: NextPage = ({ link }: Props) =>  {
	return (
		<div className="mx-auto p-3 container">
			{link ? (
				<PersonaIndex link={link} />
			) : (
				<Error />
			)}
		</div>
	);
};

Persona.getInitialProps = ({ query }) => {
	let link = query.link;
	if (typeof link === "object") link = link[0];
	return { link };
};

export default Persona;