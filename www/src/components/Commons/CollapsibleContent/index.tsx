import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import Button from "../ Button/Button";
import Typography from "../Typography/Typography";
import styles from "./Content.module.css";
import { sanitize } from "isomorphic-dompurify";

interface Props {
    content: string;
    className?: string;
	fitHeight?: boolean;
}
export default function CollapsibleContent({ content, className, fitHeight = false }: Props) {
	const [ isOpen, setOpen ] = useState(false);
	const contentRef = useRef<HTMLDivElement>(null);
 
	const doOpen = () => {
		if (contentRef.current) {
			contentRef.current.style.height = fitHeight ? "auto" : "500px";
		}
		setOpen(true);
	};

	const doClose = () => {
		if (contentRef.current) {
			contentRef.current.style.height = "300px";
		}
		setOpen(false);
	};
	return (
		<div ref={contentRef} className={clsx(className, "bg-gray-100 p-3 pt-8 rounded relative", 
			styles["collapsible-content-wrap"])}>
			<div
				dangerouslySetInnerHTML={{ __html: sanitize(content) }}
				className="h-full overflow-auto"
			>
			</div>
			{isOpen ? (
				<Button
					className="!bg-gray-300 close-btn absolute right-0 top-0"
					onClick={doClose}
					font={14}
					weight="regular"
					variant="span"
				>
				close &times;
				</Button>
			) : (
				<Button
					className="!bg-gray-200 show-more-btn absolute right-0 top-0"
					onClick={doOpen}
					font={14}
					weight="regular"
					variant="span"
				>
					show more
				</Button>
			)}
		</div>
	);
}
