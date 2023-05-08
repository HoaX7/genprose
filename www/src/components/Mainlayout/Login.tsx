import React, { useState } from "react";
import Typography from "../Commons/Typography/Typography";
import Input from "../Commons/Input/TextInput";
import { login } from "../../api/auth";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import { AlertErrorMessage } from "../Commons/Alerts";
import { setProfile } from "store/actionCreators";
import { connectStore } from "store/WithContext";
import { ProfileProps } from "@customTypes/Profile";

const connect = connectStore((state, dispatch) => ({ setProfile: (data) => setProfile(data)(dispatch) }));

interface L {
	setProfile: (data: ProfileProps) => void;
}
function Login({ setProfile }: L) {
	const [ saving, setSaving ] = useState(false);
	const [ data, setData ] = useState({
		secret_code: "",
		email: ""
	});
	return (
		<div className="flex items-center justify-center w-full h-full">
			{saving && <FullpageLoader title="Logging in..." />}
			<form onSubmit={async (e) => {
				e.preventDefault();
				setSaving(true);
				try {
					await login(data);
					setProfile({ email: data.email });
					window.location.reload();
				} catch (err) {
					console.error(err);
					AlertErrorMessage({ text: "Unable to login" });
				}
				setSaving(false);
			}}>
				<Typography
					variant="h3"
					font={18}
					weight="medium"
				>
                Enter secret code for early access
				</Typography>
				<Input 
					type={"email"}
					value={data.email}
					name="email"
					placeholder="Enter Email"
					className="w-full mt-3"
					onChange={(e) => {
						setData({
							...data,
							email: e.target.value 
						});
					}}
				/>
				<Input 
					type={"text"}
					value={data.secret_code}
					name="secret_code"
					placeholder="Enter code (Hint: AAAA)"
					className="w-full mt-3"
					onChange={(e) => {
						setData({
							...data,
							secret_code: e.target.value 
						});
					}}
				/>
				<Button type="submit"
					className="mt-3"
					disabled={saving || !data.secret_code || !data.email}
					font={16}
					weight="regular"
					variant="span"
				>
					Login
				</Button>
			</form>
		</div>
	);
}

export default connect(Login);