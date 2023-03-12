import { Bot } from "grammy";

import * as ai from './ai/openai';

const CHAT_COMMAND = 'chat';

export const bot = new Bot(process.env.TELEGRAM_TOKEN as string);

const onTextMessage = bot.on('message:text');

onTextMessage.command(CHAT_COMMAND, async (ctx) => {
  const message = getMessage(CHAT_COMMAND, ctx);
  console.log(`Received chat message=${message}`);
  if (!message) {
    console.log("Handling empty message");
    ctx.reply("Type the /chat command along with your message.\n\nExample: \"/chat what is an NFT?\"");
    return;
  }
  // Pretend that the bot is typing
  ctx.replyWithChatAction('typing');
  // Retrieve response from AI
  const response = await ai.chat(message);
  ctx.reply(response.message);
});

function getMessage(command: string, ctx): string {
  return ctx.message.text.slice(command.length + 2).trim();
}
