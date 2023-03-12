import { Bot } from "grammy";

import { OpenAIResponseError } from './ai/errors.js';
import * as ai from './ai/openai';

const CHAT_COMMAND = 'chat';

export const bot = new Bot(process.env.TELEGRAM_TOKEN as string);

const onTextMessage = bot.on('message:text');

onTextMessage.command(CHAT_COMMAND, async (ctx) => {
  const message = getMessage(CHAT_COMMAND, ctx);
  console.log(`Received chat message=${message}`);

  const response = await ai.chat(message);
  if (response instanceof OpenAIResponseError) {
    console.error(response.msg);
    ctx.reply(response.msg);
  } else {
    ctx.reply(response);
  }
});

function getMessage(command: string, ctx): string {
  return ctx.message.text.slice(command.length + 2);
}
