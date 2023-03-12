import { Bot } from "grammy";

import * as ai from './ai/openai';

export const bot = new Bot(process.env.TELEGRAM_TOKEN as string);

bot.hears(/\/chat (.+)/, async (ctx) => {
  const msg = ctx.match[1];
  console.log(`Received chat request: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} message="${msg}"`);
  // Pretend that the bot is typing
  ctx.replyWithChatAction('typing');
  // Retrieve response from AI
  const response = await ai.chat(msg);
  ctx.reply(response.message);
});
