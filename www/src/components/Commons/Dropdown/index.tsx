import React from "react";

interface Props {
    data: {
        label: string;
        value: string;
    }[];
    handleChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}
export default function Dropdown({ data, placeholder = "Select", handleChange, className }: Props) {
	return (
		<div className={className}>
			<select
				className="border bg-gray-200 w-40 rounded p-1"
				placeholder={placeholder}
				onChange={(e) => {
					handleChange(e.target.selectedOptions[0].value);
				}}
			>
				{data.map(({ label, value }) => {
					return <option key={"option_" + label} value={value}>
						{label}
					</option>;
				})}
			</select>
		</div>
	);
}
