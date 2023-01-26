/* eslint-disable max-len */
import clsx from "clsx";
import React from "react";
import Typography from "../Typography/Typography";

const ErrorIcon = () => {
	return <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-300 sm:mx-0 sm:h-10 sm:w-10">
		<svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
		</svg>
	</div>;
};

const SuccessIcon = () => {
	return <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-300 sm:mx-0 sm:h-10 sm:w-10">
		<svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="#37A34A" width="24" height="24" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
	</div>;
};

interface Props {
    title: string;
    description: string;
    closeModal: () => void;
    renderBody?: () => any;
    renderButtons?: () => any;
    icon?: "success" | "error";
    disabled?: boolean;
}
export default function Modal({
	title, description, renderButtons, closeModal, icon, renderBody, disabled
}: Props) {
	return (
		<div
			className="relative z-10"
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"></div>
			<div className="fixed z-10 inset-0 overflow-y-auto">
				<div className="flex items-end sm:items-center justify-center min-h-full text-center sm:p-0">
					<div
						className={clsx(
							"relative bg-gray-600 w-full rounded-top-corners md:rounded-lg",
							"text-left overflow-hidden shadow-xl",
							"transform transition-all sm:my-8 sm:max-w-lg sm:w-full",
						)}
					>
						<div className="bg-gray-200 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<div className={clsx("py-1 px-3 right-5 rounded text-right bg-gray-300 absolute cursor-pointer", disabled ? "pointer-events-none opacity-75" : "")}
								onClick={closeModal}
							>
                                &times;
							</div>
							<div className="sm:flex sm:items-start">
								{icon === "success" ? <SuccessIcon /> : icon === "error" ? <ErrorIcon /> : null}
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Typography
										variant="h1"
										weight="semi-bold"
										font={24}
									>
										{title}
									</Typography>
									<div className="mt-2">
										<Typography
											variant="p"
											weight="regular"
											font={16}
											className="text-gray-600"
										>
											{description}
										</Typography>
										{renderBody && renderBody()}
									</div>
								</div>
							</div>
							<div className="py-3 sm:flex sm:flex-row-reverse">
								{renderButtons && renderButtons()}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
