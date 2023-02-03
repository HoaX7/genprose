import { GeneratedContentProps, TranscriptKeywordProps } from "../@customTypes/Ai";
import { AI_MODEL_ENGINES } from "../helpers/constants";
import { requester, ApiResponse } from "../helpers/requester";

export const getTranscriptionAndKeywordsFromURL = (params: {
	url: string;
	use_chatgpt_for_keywords?: boolean;
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
}, engine = AI_MODEL_ENGINES.TEXT_DAVINCI_003.name): Promise<ApiResponse<GeneratedContentProps>> => {
	let maxChar = AI_MODEL_ENGINES.TEXT_DAVINCI_003.tokens;
	switch (engine) {
		case AI_MODEL_ENGINES.TEXT_CURIE_001.name:
			maxChar = AI_MODEL_ENGINES.TEXT_CURIE_001.tokens;
			break;
		case AI_MODEL_ENGINES.TEXT_BABBAGE_001.name:
			maxChar = AI_MODEL_ENGINES.TEXT_BABBAGE_001.tokens;
			break;
		case AI_MODEL_ENGINES.TEXT_ADA_001.name:
			maxChar = AI_MODEL_ENGINES.TEXT_ADA_001.tokens;
			break;
	}
	if (params.prompt.length > maxChar) {
		params.prompt = params.prompt.substring(0, maxChar);
	}
	return requester({
		url: "/ai/generate_content",
		data: {
			prompt: params.prompt,
			engine
		},
		method: "POST",
	});
};
