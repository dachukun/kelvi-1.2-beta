import OpenAI from 'openai';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME;

export const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: OPENROUTER_API_KEY || '',
  defaultHeaders: {
    'HTTP-Referer': SITE_URL || '',
    'X-Title': SITE_NAME || '',
  },
});