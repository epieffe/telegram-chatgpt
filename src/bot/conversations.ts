import { Conversation } from '@grammyjs/conversations';
import { ChatCompletionRequestMessage } from 'openai';
import { randomUUID } from 'crypto';
import { Context } from "grammy";

import * as ai from '../ai/openai';
import { InputMediaPhoto } from 'grammy/types';

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
    // Push user message to chat history
    hisory.push({"role": "user", "content": update.msg.text});
    // Pretend the bot is typing
    ctx.replyWithChatAction('typing');
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

export async function drawConversation(conversation: Conversation<Context>, ctx: Context) {
  // Generate randon unique identifier for this conversation
  const uuid = await conversation.external(() => randomUUID());
  conversation.log(`Started new drawing session: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} conversation_uuid=${uuid}"`);
  await ctx.reply("Ask me to draw anything.\nUse /exit to close this conversaton.");

  while (true) {
    const update = await conversation.waitFor("message:text");
    conversation.log(`Received user mesage in drawing session conversation_uuid=${uuid} message=${update.msg.text}`);

    // Check for termination message
    if (update.msg.text.trim() == "/exit") {
      conversation.log(`Terminated conversation conversation_uuid=${uuid}`);
      await ctx.reply("Bye!");
      return;
    }
    // Pretend the bot is uploading a photo
    ctx.replyWithChatAction('upload_photo');
    // Wait for DALLE response
    const response = await conversation.external(() => ai.draw(update.msg.text));
    conversation.log(`Sending draw response: request_uuid=${uuid} response=${JSON.stringify(response)}`)
    if (response.images?.length > 0) {
      const mediaGroup: InputMediaPhoto[] = response.images.map(url => ({ type: "photo", media: url }));
      ctx.replyWithMediaGroup(mediaGroup);
    } else {
      ctx.reply(response.message || "Unknown Error");
    }
  }
}
