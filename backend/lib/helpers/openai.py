"""
    -DISCLAIMER This is a Trial Prompt we could generate as an example
    to show our generative content to the user
"""
from lib.helpers.constants import PERSONA, TONE


def get_sample_prompt(keywords: list[str], persona = PERSONA.CONTENT_CREATOR, tone = TONE.PASSIVE):
    return f"""Generate a blog article as the "{persona}" persona of the company using the keywords:
    "{', '.join(keywords)}" with an "{tone}" Tone. Remove extra spacing from the blog.
    Break the sentences into multiple paragraphs."""
