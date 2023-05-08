import React, { ReactNode } from "react";
import Button from "../Commons/ Button/Button";
import StatusMenu from "../Commons/StatusMenu";
import Typography from "../Commons/Typography/Typography";
import Router from "next/router";
import { connectStore } from "store/WithContext";
import { logout, setMetadata } from "store/actionCreators";
import { logoutApi } from "api/auth";
import StepperWizard from "./StepperWizard";
import Profile from "./Profile";
import { Metadata } from "@customTypes/Ai";

const connect = connectStore((state, dispatch) => ({
	logout: () => logout()(dispatch),
	metadata: state.metadata,
	setMetadata: (props: Metadata) => setMetadata(props)(dispatch)
}));
interface Props {
	children: ReactNode;
	isLoggedIn: boolean;
	logout: () => void;
	metadata: Metadata;
	setMetadata: (props: Metadata) => void;
}

const MainLayout = ({ children, logout, metadata = {}, setMetadata }: Props) => {
	return (
		<div className="h-full">
			<div className="bg-site-gradient">
				<div className="container flex items-center justify-between mx-auto p-3">
					<Typography
						variant="div"
						font={24}
						weight="medium"
						className="hover:cursor-pointer text-white"
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							Router.push("/");
						}}
					>
						<img 
							src="../assets/images/logo-white-img.png"
							width={32}
							alt="tmc"
							className="inline"
							loading="eager"
						/> Gen Prose 
					</Typography>
					<div
						className="bg-site-transparent px-3 py-1 rounded-lg text-white"
					>
						<Profile logout={async () => {
							try {
								await logoutApi();
								logout();
								window.location.reload();	
							} catch (err) {
								console.error("Unable to logout: ", err);
							}
						}} />
					</div>
				</div>
				<StepperWizard stepper={metadata.stepper || []} setMetadata={setMetadata} />
			</div>
			<div className={"flex flex-col flex-grow h-full"}>
				<div className="scrollbar-hidden wrapper h-full">
					<main id="main" className="main mb-20">
						{children}
					</main>
				</div>
			</div>
			{/* <StatusMenu /> */}
		</div>
	);
};

export default connect(MainLayout);
