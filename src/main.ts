// Load environment variables from '.env' file
import dotenv from 'dotenv';
dotenv.config();

import { OpenAIResponseError } from './ai/errors.js';
import * as AI from './ai/openai';

async function main() {
    const response = await AI.chat("Chi ha scoperto l'America?");
    if (response instanceof OpenAIResponseError) {
        console.error(response.msg);
    } else {
        console.log(response);
    }
}

main();
