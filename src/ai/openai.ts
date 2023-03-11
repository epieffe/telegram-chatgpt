
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { OpenAIResponseError } from './errors';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function chat(input_text: string): Promise<string | OpenAIResponseError> {
	try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: createChatPrompt(input_text)
    });

    const msg = response.data.choices[0].message?.content;
    return msg || new OpenAIResponseError(JSON.stringify(response.data.choices[0]));

  } catch(error) {
    const message = error.response?.data?.error?.message;
    if (message) {
      return new OpenAIResponseError(message);
    } else {
      return new OpenAIResponseError(`Unknown error: ${JSON.stringify(error)}`);
    }
  }
}

function createChatPrompt(input_text: string): ChatCompletionRequestMessage[] {
	return [
        {"role": "system", "content": "Sei un assistente virtuale."},
        {"role": "user", "content": input_text}
    ]
}
