import React from "react";
import domPurify from "isomorphic-dompurify";
import clsx from "clsx";

interface Props {
  content: string;
  className?: string;
}
export default function Pre({ content, className }: Props) {
	return (
		<pre
			style={{ fontFamily: "inherit" }}
			className={clsx(className, "break-words whitespace-pre-line font-16")}
			dangerouslySetInnerHTML={{ __html: domPurify.sanitize(content) }}
		></pre>
	);
}
