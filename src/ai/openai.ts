
import fs from 'fs';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { ChatResponse, DrawResponse } from './interfaces';

const CHAT_PROMPT_PATH = process.env.CHAT_PROMPT_PATH || 'prompt.txt';

let system_prompt;
try {
  system_prompt = fs.readFileSync(CHAT_PROMPT_PATH, 'utf8');
  console.log(`Found custom ChatGPT prompt at ${CHAT_PROMPT_PATH}`)
} catch (err) {
  system_prompt = 'You are a virtual assistant. Give short but very detailed answers.';
  console.warn(`Unable to find custom ChatGPT prompt, using default. reason=${err.message}`);
}

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function chat(messages: ChatCompletionRequestMessage[]): Promise<ChatResponse> {
	try {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {'role': 'system', 'content': system_prompt},
        ...messages
      ]
    });
    const message = response.data.choices[0].message?.content;
    return {
      status: 200,
      message: message || JSON.stringify(response.data.choices[0])
    }

  } catch(error) {
    const response = unwrapError(error);
    console.error(`Error while retrieving chat response for messages=${messages} status=${response.status} error=${response.message}`);
    return response;
  }
}

export async function draw(input_text: string): Promise<DrawResponse> {
  try {
    const response = await openai.createImage({
      prompt: input_text,
      n: 4,
      size: '256x256',
    });
    const images = response.data.data.map(img => img.url);
    return { status: 200, images: images}
  } catch(error) {
    const response = unwrapError(error)
    console.error(`Error while retrieving draw response for message=${input_text} status=${response.status} error=${response.message}`);
    return response;
  }
}

function unwrapError(error): {status?: number; message: string} {
  const message = error.response?.data?.error?.message;
    if (message) {
      const status = error.response.status;
      return { status, message };
    } else {
      return { message: `Unknown error: ${JSON.stringify(error)}` };
    }
}
