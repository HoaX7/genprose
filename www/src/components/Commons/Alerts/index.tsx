import React from "react";
import Modal from "../Modal/Modal";
import { createRoot, Root } from "react-dom/client";

let root: Root;
const el = typeof window !== "undefined" ? document.getElementById("modal-root") : null;
if (typeof window !== "undefined" && el) root = createRoot(el);

type AlertProps = {
    title?: string;
    text: string;
}
export function AlertMessage({
	title = "Attention",
	text
}: AlertProps) {
	root?.render(<Modal 
		closeModal={() => {
			root?.unmount();
			if (el) {
				root = createRoot(el);
			}
		}}
		title={title}
		description={text}
	/>);
}

export function AlertErrorMessage({
	title = "Error",
	text
}: AlertProps) {
	root?.render(<Modal 
		closeModal={() => {
			root?.unmount();
			if (el) {
				root = createRoot(el);
			}
		}}
		title={title}
		description={text}
		icon="error"
	/>);
}

export function AlertSuccessMessage({
	title = "Success",
	text
}: AlertProps) {
	root?.render(<Modal 
		closeModal={() => {
			root?.unmount();
			if (el) {
				root = createRoot(el);
			}
		}}
		title={title}
		description={text}
		icon="success"
	/>);
}