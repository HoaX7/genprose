import React, { ReactNode } from "react";
import Button from "../Commons/ Button/Button";
import Typography from "../Commons/Typography/Typography";

interface Props {
	children: ReactNode;
	isLoggedIn: boolean;
}

const MainLayout = ({ children }: Props) => {
	return (
		<div className="h-full">
			<div className="container flex items-center justify-between mx-auto p-3">
				<Typography
					variant="div"
					font={32}
					weight="bold"
					className=""
				>
				Content AI
				</Typography>
				<Button
					type="button"
					onClick={() => {
						localStorage.removeItem("is-logged-in");
						window.location.reload();
					}}
				>
				Logout
				</Button>
			</div>
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
