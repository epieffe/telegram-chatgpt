import { ConversationFlavor, conversations, createConversation } from '@grammyjs/conversations';
import { Bot, Context, session } from "grammy";

import { chatCommand, drawCommand } from './commands';
import { chatConversation, drawConversation } from './conversations';
import { checkPermission } from './util';

const bot = new Bot<Context & ConversationFlavor>(process.env.TELEGRAM_TOKEN as string);
export default bot;

// Install the session and conversation plugins.
bot.use(session({initial() {return {};}}));
bot.use(conversations());

// Register conversations
bot.use(createConversation(chatConversation, "chat"));
bot.use(createConversation(drawConversation, "draw"));

// Handle /start command in private chat
bot.chatType("private").command("start",async (ctx) => {
  if (!checkPermission(ctx, bot.api)) return;
  ctx.reply(`You can do the following things:

PRIVATE CHAT
/chat - start a conversation with my ai
/draw - ask me to draw something

GROUP CHAT
/chat <your question> - ask a single question to my ai
/draw <something> - ask me to draw something`);
})

// Handle /chat command in private chat
bot.chatType("private").command("chat", async (ctx) => {
  if (!checkPermission(ctx, bot.api)) return;
  // Enter conversation with ai assistant
  await ctx.conversation.enter("chat");
});

// Handle /draw command in private chat
bot.chatType("private").command("draw", async (ctx) => {
  if (!checkPermission(ctx, bot.api)) return;
  // Enter drawing conversation
  await ctx.conversation.enter("draw");
});

// Handle /chat command in group chat
bot.hears(/\/chat (.+)/, chatCommand);

// Handle /draw command in group chat
bot.hears(/\/draw (.+)/, drawCommand);

// Log unknown messages
bot.on('message', (ctx) => {
  console.debug(`Unknown message: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} message="${ctx.message.text}"`);
})
