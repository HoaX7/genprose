import React, { ReactNode } from "react";
import Typography from "../Commons/Typography/Typography";

interface Props {
	children: ReactNode;
	isLoggedIn: boolean;
}

const MainLayout = ({ children }: Props) => {
	return (
		<div className="h-full">
			<Typography
				variant="div"
				font={32}
				weight="bold"
				className="p-2"
			>
				The Content Machine
			</Typography>
			<div className={"flex flex-col flex-grow h-full"}>
				<div className="scrollbar-hidden wrapper h-full">
					<main id="main" className="main mb-20">
						{children}
					</main>
				</div>
			</div>
		</div>
	);
};

export default MainLayout;
