import clsx from "clsx";
import React from "react";

interface Props {
  size?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const classMap = {
	xxs: {
		h: "h-4",
		w: "w-4",
	},
	xs: {
		h: "h-8",
		w: "w-8",
	},
	sm: {
		h: "h-12",
		w: "w-12",
	},
	md: {
		h: "h-16",
		w: "w-16",
	},
	lg: {
		h: "h-24",
		w: "w-24",
	},
	xl: {
		h: "h-34",
		w: "w-34",
	},
};
export default function SuccessTicketIcon({ size = "xl", className }: Props) {
	return (
		<input
			checked
			id="checked-checkbox"
			type="checkbox"
			value=""
			readOnly={true}
			className={clsx(
				"rounded-full accent-green-600",
				className,
				classMap[size].h,
				classMap[size].w
			)}
		/>
	);
}
