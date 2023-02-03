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
