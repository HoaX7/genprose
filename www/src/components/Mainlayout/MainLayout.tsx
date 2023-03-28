import React, { ReactNode } from "react";
import Button from "../Commons/ Button/Button";
import StatusMenu from "../Commons/StatusMenu";
import Typography from "../Commons/Typography/Typography";
import Router from "next/router";
import { connectStore } from "store/WithContext";
import { logout } from "store/actionCreators";
import { logoutApi } from "api/auth";

const connect = connectStore((state, dispatch) => ({ logout: () => logout()(dispatch) }));
interface Props {
	children: ReactNode;
	isLoggedIn: boolean;
	logout: () => void;
}

const MainLayout = ({ children, logout }: Props) => {
	return (
		<div className="h-full">
			<div className="container flex items-center justify-between mx-auto p-3">
				<Typography
					variant="div"
					font={32}
					weight="light"
					className="hover:cursor-pointer"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						Router.push("/");
					}}
				>
				Content AI
				</Typography>
				<Button
					type="button"
					onClick={async () => {
						await logoutApi();
						logout();
						window.location.reload();
						// Router.push("/");
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
			<StatusMenu />
		</div>
	);
};

export default connect(MainLayout);
