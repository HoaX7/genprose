export type Status = "INPROGRESS" | "COMPLETED" | "QUEUED";
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

export type ContentProps<T = string> = {
  unique_id: string;
  content: T;
  content_type: ContentTypes;
  status: Status,
  email: string;
  args: {
    link?: string;
    path?: string;
    text?: string;
    use_chatgpt_for_keywords?: boolean;
    prompt?: string;
    generate_content_unique_id?: string;
  }
}

export type PollParams = {
  unique_id: string;
}

export type StatusObject = {
  content_type: ContentTypes;
  status: Status;
  name: string;
  isComplete: boolean;
  id: string;
}