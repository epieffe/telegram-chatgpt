import { randomUUID } from 'crypto';
import { Context } from "grammy";
import { InputMediaPhoto } from 'grammy/types';

import * as ai from '../ai/openai';

export async function chatCommand(ctx: Context) {
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
  // Generate randon unique identifier for this request
  const uuid = randomUUID();
  const message = ctx.match[1];
  console.log(`Received draw request: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} request_uuid=${uuid} message="${message}"`);

  // Pretend the bot is uploading a photo
  ctx.replyWithChatAction('upload_photo')
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
