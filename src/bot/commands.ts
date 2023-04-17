import { randomUUID } from 'crypto';
import { Context } from "grammy";
import { InputMediaPhoto } from 'grammy/types';

import { checkPermission } from './util';
import * as ai from '../ai/openai';
import bot from '../bot/bot';

export async function chatCommand(ctx: Context) {
  // Check if user has permission to chat with the bot
  if (!checkPermission(ctx, bot.api)) return;

  // Generate randon unique identifier for this request
  const uuid = randomUUID();
  const message = ctx.match[1];
  console.log(`Received chat request: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} request_uuid=${uuid} message="${message}"`);
  // Pretend that the bot is typing
  ctx.replyWithChatAction('typing');
  // Retrieve response from AI
  const response = await ai.chat([{"role": "user", "content": message}]);
  console.log(`Sending chat response: request_uuid=${uuid} status=${response.status} response=${response.message}`)
  ctx.reply(response.message);
}

export async function drawCommand(ctx: Context) {
  // Check if user has permission to chat with the bot
  if (!checkPermission(ctx, bot.api)) return;

  ctx.replyWithChatAction('upload_photo')
  // Generate randon unique identifier for this request
  const uuid = randomUUID();
  const message = ctx.match[1];
  console.log(`Received draw request: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} request_uuid=${uuid} message="${message}"`);
  // Retrieve images from AI
  const response = await ai.draw(message);
  console.log(`Sending draw response: request_uuid=${uuid} response=${JSON.stringify(response)}`)
  if (response.images?.length > 0) {
    const mediaGroup: InputMediaPhoto[] = response.images.map(url => ({ type: "photo", media: url }));
    ctx.replyWithMediaGroup(mediaGroup);
  } else {
    ctx.reply(response.message || "Unknown Error");
  }
}
