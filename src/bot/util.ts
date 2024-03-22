import { Api, Context } from "grammy";

// Members of whitelisted groups can chat with the bot
const whitelistedGroups = splitNumbers(process.env.WHITELISTED_GROUP_IDS);
// Also whitelisted users can chat with the bot
const whitelistedUsers = splitNumbers(process.env.WHITELISTED_USER_IDS);

/**
 * Check if user has permission to chat with the bot
 *
 * @param ctx message context
 * @param api bot api
 * @returns true if user has permission to chat with the bot
 */
export async function checkPermission(ctx: Context, api: Api): Promise<boolean> {
  // If no whitelisted group and no whitelisted user is specified the bot is accessible to anyone
  if (whitelistedGroups.length + whitelistedUsers.length == 0) {
    return true;
  }
  if (whitelistedGroups.includes(ctx.chat.id) || whitelistedUsers.includes(ctx.from.id)) {
    return true;
  }
  const hasPermission = await groupsIncludeUser(whitelistedGroups, ctx.from.id, api);
  if (!hasPermission) {
    console.warn(`Unauthorized access: user_id=${ctx.from.id} username=${ctx.from.username} chat_id=${ctx.chat.id} chat_type=${ctx.chat.type} message="${ctx.message.text}`);
  }
  return hasPermission;
}

async function groupsIncludeUser(groupIds: number[], userId: number, api: Api): Promise<boolean> {
  for (const groupId of groupIds) {
      try {
          const member = await api.getChatMember(groupId, userId);
          if (member && member.status !== 'left' && member.status !== 'kicked') {
              return true;
          }
      } catch (error) {
          console.error(error);
      }
  }
  return false;
}

function splitNumbers(value: string): number[] {
  return !value ? [] : value.split(',').map(id => Number(id));
}
