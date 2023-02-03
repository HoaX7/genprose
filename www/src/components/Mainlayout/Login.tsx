import React, { useState } from "react";
import Typography from "../Commons/Typography/Typography";
import Input from "../Commons/Input/TextInput";
import { login } from "../../api/auth";
import Button from "../Commons/ Button/Button";
import FullpageLoader from "../Commons/Loaders/FullpageLoader";
import { AlertErrorMessage } from "../Commons/Alerts";

export default function Login() {
	const [ code, setCode ] = useState("");
	const [ saving, setSaving ] = useState(false);
	return (
		<div className="flex items-center justify-center w-full h-full">
			{saving && <FullpageLoader title="Logging in..." />}
			<form onSubmit={async (e) => {
				e.preventDefault();
				setSaving(true);
				try {
					await login({ secret_code: code });
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
					weight="bold"
				>
                Enter secret code for early access
				</Typography>
				<Input 
					type={"text"}
					value={code}
					name="secret_code"
					placeholder="Enter code (Hint: AAAA)"
					className="w-full"
					onChange={(e) => {
						setCode(e.target.value);
					}}
				/>
				<Button type="submit"
					className="mt-3"
					disabled={saving || !code}
				>
					Login
				</Button>
			</form>
		</div>
	);
}
