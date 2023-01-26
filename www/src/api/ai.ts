import { GeneratedContentProps, TranscriptKeywordProps } from "../@customTypes/Ai";
import { requester, ApiResponse } from "../helpers/requester";

export const getTranscriptionAndKeywordsFromURL = (params: {
	url: string;
}): Promise<ApiResponse<TranscriptKeywordProps>> => {
	return requester({
		url: "/ai/get_transcript",
		data: params,
		method: "POST",
	});
};

export const getContentFromKeywords = (params: {
  keywords: string[];
}): Promise<ApiResponse<GeneratedContentProps>> => {
	return requester({
		url: "/ai/get_content",
		data: params,
		method: "POST",
	});
};
