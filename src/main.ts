// Load environment variables from '.env' file
import dotenv from 'dotenv';
dotenv.config();

import bot from './bot/bot';

bot.start();

console.log("Telegram bot started")
