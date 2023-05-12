export const getPrompt = (keywords: string[], persona: string, tone: string) => {
	return `Generate a blog article as the ${persona} persona of the company using 
    the keywords '${keywords.join(", ")}' with an '${tone}' Tone. Remove extra spacing from the blog. 
    Break the sentences into multiple paragraphs.`;
};