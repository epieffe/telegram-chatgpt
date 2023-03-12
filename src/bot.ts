import { Api, Bot, Context } from "grammy";

import * as ai from './ai/openai';

// Only members of this group can chat with the bot
const WHITELISTED_GROUP_ID = Number(process.env.TELEGRAM_WHITELISTED_GROUP_ID);

// Whitelisted user can chat with the bot even if they are not member of the whitelisted group
const WHITELISTED_USER_IDS = process.env.TELEGRAM_WHITELISTED_USER_IDS.split(',').map(id => Number(id));

const bot = new Bot(process.env.TELEGRAM_TOKEN as string);
export default bot;

bot.hears(/\/chat (.+)/, async (ctx) => {
  // Check if user has permission to chat with the bot
  if (!checkPermission(ctx, bot.api)) return;

  const message = ctx.match[1];
  console.log(`Received chat request: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} message="${message}"`);
  // Pretend that the bot is typing
  ctx.replyWithChatAction('typing');
  // Retrieve response from AI
  const response = await ai.chat(message);
  ctx.reply(response.message);
});

/**
 * Check if user has permission to chat with the bot
 *
 * @param ctx message context
 * @param api bot api
 * @returns true if user has permission to chat with the bot
 */
async function checkPermission(ctx: Context, api: Api): Promise<boolean> {
  if (ctx.chat.id == WHITELISTED_GROUP_ID || WHITELISTED_USER_IDS.includes(ctx.from.id)) {
    return true;
  }
  const member = await api.getChatMember(WHITELISTED_GROUP_ID, ctx.from.id);
  const hasPermission = member.status != 'left' && member.status != 'kicked';
  if (!hasPermission) {
    console.error(`Unauthorized access: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} message="${ctx.message.text}`);
  }
  return hasPermission;
}
