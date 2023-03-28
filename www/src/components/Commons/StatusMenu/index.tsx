import { StatusObject } from "@customTypes/Ai";
import clsx from "clsx";
import React from "react";
import { setGlobalStatus, setQueueMessage } from "store/actionCreators";
import { connectStore } from "store/WithContext";
import Button from "../ Button/Button";
import Spinner from "../Loaders/Spinner";
import Typography from "../Typography/Typography";
import SuccessTicketIcon from "./SuccessTicketIcon";

const connect = connectStore((state, dispatch) => ({
	globalStatus: state.globalStatus,
	queueMessage: state.queueMessage,
	setGlobalStatus: (props) => setGlobalStatus(props)(dispatch),
	setQueueMessage: (props) => setQueueMessage(props)(dispatch),
}));

interface Props {
  globalStatus: StatusObject[];
  queueMessage: string;
  setGlobalStatus: (props: StatusObject[]) => void;
  setQueueMessage: (props: string) => void;
}
function StatusMenu({
	queueMessage = "All tasks completed",
	globalStatus,
	setGlobalStatus,
	setQueueMessage,
}: Props) {
	if (!queueMessage) {
		queueMessage = "All tasks completed";
	}
	return (
		<div className="mt-3 container mx-auto flex justify-end fixed bottom-0 right-0 left-0">
			<div className="flex flex-col rounded-t-xl border shadow w-full lg:w-1/4 md:w-2/4">
				<Typography
					variant="div"
					className="bg-gray-100 p-3 rounded-t-xl flex justify-between"
					weight="medium"
					font={16}
				>
					{queueMessage}{" "}
					<Button
						onClick={() => {
							if (globalStatus.length > 0) {
								setQueueMessage(`Completed ${globalStatus.filter((g) => g.isComplete).length} Tasks`);
								setGlobalStatus([]);
							}
						}}
						className={clsx(
							"rounded-full w-6 h-6 !bg-transparent hover:!bg-gray-200",
							"flex items-center justify-center"
						)}
					>
            &times;
					</Button>
				</Typography>
				<ul className="list-none bg-white">
					{globalStatus.map((item, i) => (
						<li
							className="px-3 py-2"
							key={"status_li_" + item.content_type + "_" + i}
						>
							<Typography
								variant="span"
								weight="medium"
								font={14}
								className="flex justify-between items-center"
							>
								{item.name}{" "}
								<div className="flex items-center">
									<small className="text-gray-400 mr-2">{item.status}</small>
									{item.isComplete ? (
										<SuccessTicketIcon size="xxs" />
									) : (
										<Spinner size="xxs" />
									)}
								</div>
							</Typography>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default connect(StatusMenu);
