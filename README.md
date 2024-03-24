# OpenAI Telegram Bot
[![Node.js](https://img.shields.io/badge/Node.js->=%2018-blue.svg)](https://nodejs.org)
[![AGPLv3](https://img.shields.io/badge/license-AGPLv3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0.html)

Telegram bot backed by OpenAI [Chat Completions](https://platform.openai.com/docs/guides/text-generation/chat-completions-api) and [Image generations](https://platform.openai.com/docs/guides/images) API.

## Overview

#### Private chat commands
- `/chat`: start a chat conversation
- `/draw`: start a drawing conversation
- `/exit`: exit current conversation

#### Group chat commands
- `/chat <question>`: ask a question
- `/draw <subject>`: generate an image

Conversations are not available in group chats, so the bot does not remember previously asked questions, while in private `/chat` conversations it remembers previous messages until you `/exit` the conversation.

## Getting Started
To run the bot you need the following requirements:
- [Node.js](https://nodejs.org) >= 18
- A [Telegram](https://telegram.org) bot token
- An [OpenAI](https://openai.com/product) API Key

#### Obtain Telegram Bot Token
Contact the [@BotFather](https://t.me/botfather) on Telegram, send the `/newbot` command and follow the steps.

#### Obtain OpenAI API Key
- Create an account on [platform.openai.com](https://platform.openai.com)
- Navigate to the [Billing page](https://platform.openai.com/account/billing) and add credit to balance (minimum 5$ is required)
- Navigate to the [API key page](https://platform.openai.com/api-keys) and create a new secret key

### Environment Variables
Environment variables can be read from the operating system or from a `.env` file in the current directory. You can use the `.env.example` file as a starting point to create your own `.env` file. Some variables are optional, while others are required for the bot to start properly.
| Variable              | Description | Required |
| --------------------- | ----------- | -------- |
| TELEGRAM_TOKEN        | The Telegram bot token | true |
| OPENAI_API_KEY        | The OpenAI API key | true |
| CHAT_PROMPT_PATH      | Relative file path for a custom chat system prompt, defaults to `prompt.txt` | false |
| WHITELISTED_GROUP_IDS | Comma separated ids of groups whose members are allowed to chat with the bot | false |
| WHITELISTED_USER_IDS  | Comma separated ids of users allowed to chat with the bot | false |

### Run the Bot
Before running the bot for the first time you need to install the required dependencies:
```bash
npm install
```
Create a `.env` file or set the required environment variables in the operating system. If you want to create the `.env` file you can use the `.env.example` file as an example. If you want to use OS environment variables you can run the following commands on UNIX systems like Mac or Linux, replacing `<your token>` and `<your key>` with actual values:
```bash
export TELEGRAM_TOKEN=<your token>
export OPENAI_API_KEY=<your key>
```

Now you are ready to start the bot:
```bash
npm start
```

#### Production build
For running in production it is better to use the `build` script to generate a production build
```bash
npm run build
```
Now run the generated build files using `node`:
```bash
node build/src/main.js
```

### Custom Chat System Prompt
You can optionally define a system message to set the behavior of the bot during chats. For example, you can modify the personality of the bot or provide it with specific knowledge about your organization.

By default the bot searches for a system message in the `prompt.txt` file in the current directory during startup. If not found, no system message is used. To change the file path where to search the system message use the `CHAT_PROMPT_PATH` environment variable.

### Access Restrictions
By default the bot is accessible to anyone. You can restrict the bot access to a limited set of users or to members of specific groups.

The bot is accessible to all the users listed in the `WHITELISTED_USER_IDS` environment variable AND to members of any of the groups listed in the `WHITELISTED_GROUP_IDS` environment variable. If none of these variables are set, then the bot is accessible to anyone.

The bot needs to be member of all the groups listed in the `WHITELISTED_GROUP_IDS` environment variable.

#### Get your user id
The easiest way to get your user id is to contact the [@userinfobot](https://t.me/userinfobot), send a message and it will reply with your info, including the user id. Please note that I am not in any way affiliated with the @userinfobot and I am not responsible for how it works or how it manages data.

#### Get group id
Please  read [this thread on Stack Overflow](https://stackoverflow.com/questions/32423837/telegram-bot-how-to-get-a-group-chat-id) for usefull tips on how to get a group chat id.

## License
This work is licensed under the [AGPLv3](https://www.gnu.org/licenses/agpl-3.0.html). Visit [Why the Affero GPL](https://www.gnu.org/licenses/why-affero-gpl.html) on gnu.org to know why.
