import React from "react";
import ReactDOM from "react-dom";

interface Props {
    renderModal: () => any;
}
export default function ModalWrapper({ renderModal }: Props) {
	let modalRoot = null;
	if (typeof window !== "undefined") {
		modalRoot = document.getElementById("modal-root");
	}
	console.log(modalRoot);
	if (!modalRoot) return null;
	return (
		<div>{ReactDOM.createPortal(renderModal(), modalRoot)}</div>
	);
}
