import { ContentProps, ContentTypes, GeneratedContentProps, TranscriptKeywordProps } from "../@customTypes/Ai";
import { AI_MODEL_ENGINES } from "../helpers/constants";
import { requester, ApiResponse, RequestMethodParams } from "../helpers/requester";

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

export const executeFuncAndGetUniqueId = <T>(params: {
	method: RequestMethodParams;
	data: T;
	url: string;
}): Promise<ApiResponse<string>> => {
	return requester({
		data: params.data,
		url: params.url,
		method: params.method
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

export const prepareContentParams = (prompt: string, engine: string) => {
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
	if (prompt.length > maxChar) {
		prompt = prompt.substring(0, maxChar);
	}
	return prompt;
};

export const getContentById = async ({ id }: { id: string; }) => {
	return requester<{ unique_id: string; }, ContentProps<string>>({
		method: "POST",
		url: "/ai/preview_transcript",
		data: { unique_id: id }
	});
};

type P = { content_type: ContentTypes, cookies?: any; }
export const getContentByEmail = async <R>(params: P) => {
	const cookies = params.cookies;
	if (params.cookies) delete params.cookies;
	return requester<P, R>({
		method: "GET",
		data: params,
		url: "/ai/fetch_by_email",
		headers: cookies ? { cookies: JSON.stringify({ token: cookies.token }) } : {}
	});
};