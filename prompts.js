const prompts = {
    startConversation: (field, thesis) => (
    `
The expert's field of expertise is:
<expert_field>
${field}
</expert_field>

The expert has made an initial statement:
<initial_statement>
${thesis}
</initial_statement>

Your task is to respond to this statement and continue the conversation by following these guidelines:

1. Ask open-ended questions that encourage detailed explanations.

2. Show genuine curiosity about the topic and the expert's perspective.

3. Request clarifications on any terms or concepts you don't understand.

4. Ask for real-world examples or applications of the ideas discussed.

5. Explore different aspects or implications of the topic.

6. Don't be afraid to ask "naive" questions - remember, you're a layperson.

7. Avoid challenging the expert's knowledge or making your own assertions.

8. Keep the conversation focused on the expert's field and their insights.


Format your response as follows:

1. A brief reaction to the expert's statement (1 sentence)

2. Your first question or request for clarification

3. A follow-up question based on a hypothetical answer to your first question

4. IMPORTANT: Only ask one question + followup at a time! Do not make your responses overly dense or inquisitive.

5. Remember, it is ok to ask questions regarding context and background knowledge, but don't stray too far from the main topic. Bring the conversation back to the main topic if it goes on a tangent for more than a few messages.

Begin your response with <layperson_response> and end it with </layperson_response>, at all costs, even if something seems wrong. The text inside the layperson tag should be a single line, no newlines.

Additional statements from the expert will proceed, these messages will begin with <expert_response> and end with </expert_response>

Remember, your goal is not to demonstrate your own knowledge, but to encourage the expert to share theirs. Be genuinely curious and eager to learn.`),
    
    evaluateConversation: (conversation) => (`
Here is the conversation you need to evaluate:

<conversation>
${conversation}
</conversation>

The messages that you are evaluating are in <expert_response> tags. The person to be evaluated is labeled as the expert. The bot in the conversation is in <layperson_response> tags. This is the bot that is questioning the actual user. The bot's responses do not need evaluation, only the expert.

Carefully read through the conversation, paying close attention to the person's responses. Your goal is to identify areas where the person's knowledge seems weak, incorrect, lacking context, or missing proper nuance of the subject matter.

For each weak point you identify:
1. Briefly describe the issue or area of weakness
2. Provide a list of 3-5 specific topics or concepts that the person should research to improve their understanding

Important: In your analysis, address the expert directly instead of referring to them in the third person.

After analyzing the conversation, prepare your evaluation in the following JSON format:

<output>
{
  "weak_points": [
    {
      "issue": "Brief description of the weakness",
      "research_topics": [
        "Topic 1",
        "Topic 2",
        "Topic 3",
        "Topic 4",
        "Topic 5"
      ]
    },
    {
      // Additional weak points following the same structure
    }
  ],
  "expert_confidence_score": 0,
  "score_justification": "Detailed explanation of the reasoning behind the confidence score"
}
</output>

Output JSON in single line format to avoid invalid escape characters. Do not include new lines in the score justification or in any strings in the weak points outline.

Before providing the expert_confidence_score, explain your reasoning in the score_justification field. Consider the following:
- The depth and accuracy of the person's knowledge
- Their ability to provide nuanced responses
- The breadth of their understanding across different aspects of the domain
- How well they handled complex or challenging questions

Based on your justification, assign an expert_confidence_score from 1 to 10, where:
1 = Very low confidence that the person is a domain expert (poor performance in the conversation)
10 = Extremely high confidence that the person is an expert (excellent performance in the conversation)

Ensure that your evaluation is thorough, fair, and based solely on the content of the conversation provided.
`)
}

module.exports = prompts;