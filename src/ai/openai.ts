
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { ChatResponse } from './interfaces';

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function chat(input_text: string): Promise<ChatResponse> {
	try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: createChatPrompt(input_text)
    });

    const message = response.data.choices[0].message?.content;
    return {
      status: 200,
      message: message || JSON.stringify(response.data.choices[0])
    }

  } catch(error) {
    console.error(`Error while retrieving chat response for message=${input_text}`, error);
    const message = error.response?.data?.error?.message;
    if (message) {
      const status = error.response.status;
      return { status, message };
    } else {
      return { message: `Unknown error: ${JSON.stringify(error)}` };
    }
  }
}

function createChatPrompt(input_text: string): ChatCompletionRequestMessage[] {
	return [
        {"role": "system", "content": "Sei un assistente virtuale."},
        {"role": "user", "content": input_text}
    ]
}
