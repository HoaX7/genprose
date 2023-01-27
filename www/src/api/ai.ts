import { GeneratedContentProps, TranscriptKeywordProps } from "../@customTypes/Ai";
import { requester, ApiResponse } from "../helpers/requester";

export const getTranscriptionAndKeywordsFromURL = (params: {
	url: string;
}): Promise<ApiResponse<TranscriptKeywordProps>> => {
	return requester({
		url: "/ai/get_transcript",
		data: params,
		method: "POST",
		timeout: 120000
	});
};

export const getContentFromKeywords = (params: {
  prompt: string;
}): Promise<ApiResponse<GeneratedContentProps>> => {
	return requester({
		url: "/ai/generate_content",
		data: params,
		method: "POST",
	});
};
