export const MAX_ALLOWED_KEYWORDS = 20;

export const AI_MODEL_ENGINES: {
    [key: string]: {
        name: string;
        tokens: number;
        description: string;
    }
} = {
	TEXT_DAVINCI_003: {
		name: "text-davinci-003",
		tokens: 4000,
		description: `Most capable GPT-3 model. Can do any task the other models can do, 
        often with higher quality, longer output and better instruction-following. 
        Also supports inserting completions within text.`
	},
	TEXT_CURIE_001: {
		name: "text-curie-001",
		tokens: 2048,
		description: "Very capable, but faster and lower cost than Davinci."
	},
	TEXT_BABBAGE_001: {
		name: "text-babbage-001",
		tokens: 2048,
		description: "Capable of straightforward tasks, very fast, and lower cost."
	},
	TEXT_ADA_001: {
		name: "text-ada-001",
		tokens: 2048,
		description: "Capable of very simple tasks, usually the fastest model in the GPT-3 series, and lowest cost."
	}
};

export const PROGRESSIVE_STATUS = {
	QUEUED: "QUEUED",
	INPROGRESS: "INPROGRESS",
	COMPLETED: "COMPLETED",
	PRIORITY_QUEUE: "PRIORITY_QUEUE",
	ERROR: "ERROR"
};

export const CONTENT_TYPES = {
	EXTRACT_AUDIO: "EXTRACT_AUDIO",
	EXTRACT_KEYWORDS: "EXTRACT_KEYWORDS",
	EXTRACT_CONTENT: "EXTRACT_CONTENT",
	EXTRACT_TRANSCRIPT: "EXTRACT_TRANSCRIPT"
};

export const STATE_NAME = "tcm_state";