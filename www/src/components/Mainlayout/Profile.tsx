import Button from "components/Commons/Button/Button";
import { CaretSvg } from "components/Commons/Svg";
import Typography from "components/Commons/Typography/Typography";
import React from "react";

interface Props {
    logout: () => void;
}

export default function Profile({ logout }: Props) {
	return (
		<div className="flex items-center justify-between relative cursor-pointer">
			<div className="bg-white rounded-full w-5 h-5">
			</div>
			<Typography
				variant="div"
				font={16}
				weight="regular"
				className="ml-1"
			>
                John
			</Typography>
			<Button
				weight="regular"
				font={16}
				variant="span"
				className="!bg-transparent !p-0 ml-2"
				onClick={(e) => {
					e.stopPropagation();
					e.preventDefault();
					logout();
				}}
			>
				<img 
					alt="logout"
					src="../assets/images/logout.svg"
					width={16}
				/>
			</Button>
			{/* <CaretSvg 
				fill="#fff"
				className="rotate-90 ml-2"
				width={16}
			/> */}
		</div>
	);
}
