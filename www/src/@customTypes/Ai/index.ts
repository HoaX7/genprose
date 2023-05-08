export type Status = "INPROGRESS" | "COMPLETED" | "QUEUED" | "ERROR";
export type ContentTypes = "EXTRACT_AUDIO" | "EXTRACT_KEYWORDS" | "EXTRACT_CONTENT" | "EXTRACT_TRANSCRIPT"
export type TranscriptKeywordProps = {
  transcript: string;
  keywords: string[][];
};

export type GeneratedContentProps = {
  choices: [
    {
      text: string;
    }
  ];
  id: string;
  model: "text-davinci-003";
  object: "text_completion";
  usage: {
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
  };
};

type TO = {
  transcript: string;
};
export type TestTranscriptData = {
  id: string;
  content: {
    assembly_ai: TO;
    deepgram_base: TO;
    deepgram_enhanced: TO;
    deepgram_nova: TO;
  };
  args: {
    link: string;
    path: string;
  };
  content_type: ContentTypes;
  status: Status;
  user_id: string;
}

export type ContentProps = {
  id: string;
  content?: string[];
  keywords?: string[];
  transcript?: string;
  content_type: ContentTypes;
  status: Status,
  user_id: string;
  is_private: boolean;
  args: {
    link?: string;
    path?: string;
    text?: string;
    use_chatgpt_for_keywords?: boolean;
    prompt?: string;
    generate_content_unique_id?: string;
    title?: string;
    persona?: string;
    tone?: string;
  }
}

export type PollParams = {
  id: string;
}

export type StatusObject = {
  content_type: ContentTypes;
  status: Status;
  name: string;
  isComplete: boolean;
  id: string;
}

export type Metadata = {
  url?: string;
  stepper?: string[];
}