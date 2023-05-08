export const getPrompt = (keywords: string[], persona: string, tone: string) => {
	return `Generate a blog article as the ${persona} persona of the company using 
    the keywords '${keywords.join(", ")}' with a '${tone}' Tone. Start the blog with a 
    word and trim the text. Break the sentences into multiple paragraphs.`;
};