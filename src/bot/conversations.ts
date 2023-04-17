import { Conversation } from '@grammyjs/conversations';
import { ChatCompletionRequestMessage } from 'openai';
import { randomUUID } from 'crypto';
import { Context } from "grammy";

import * as ai from '../ai/openai';

const MAX_MESSAGES = 50;

export async function chatConversation(conversation: Conversation<Context>, ctx: Context) {
  // Generate randon unique identifier for this conversation
  const uuid = await conversation.external(() => randomUUID());
  conversation.log(`Started new conversation: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} conversation_uuid=${uuid}"`);
  await ctx.reply("Conversation started. Use /exit to leave.\n\nAsk me anything!");

  const hisory: ChatCompletionRequestMessage[] = [];

  while (hisory.length < MAX_MESSAGES) {
    // Wait for user message
    const update = await conversation.waitFor("message:text");
    conversation.log(`Received user mesage in conversation conversation_uuid=${uuid} message=${update.msg.text}`);
    // Check for termination message
    if (update.msg.text.trim() == "/exit") {
      conversation.log(`Terminated conversation conversation_uuid=${uuid}`);
      await ctx.reply("Bye!");
      return;
    }
    // Pretend the bot is typing
    ctx.replyWithChatAction('typing');
    // Push user message to chat history
    hisory.push({"role": "user", "content": update.msg.text});
    // Wait for ChatGPT response
    const response = await conversation.external(() => ai.chat(hisory));
    if (response.status == 200) {
      // Response success
      conversation.log(`Received assistant response in conversation conversation_uuid=${uuid} status=${response.status} message=${response.message}`);
      ctx.reply(response.message);
      hisory.push({"role": "assistant", "content": response.message});
    } else {
      // Response error
      conversation.error(`Error in conversation ${uuid} status=${response.status} message=${response.message}`);
      ctx.reply(`Error ${response.status}: ${response.message}`);
    }
  }
  // If we arrive here user has reached max number of messages in conversation
  ctx.reply("This conversation is too long, I'm leaving");
}
