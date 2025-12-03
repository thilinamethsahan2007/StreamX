import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('GEMINI_API_KEY is missing in .env.local');
    process.exit(1);
}

async function listModels() {
    try {
        console.log('Testing with key:', apiKey!.substring(0, 5) + '...');
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('API Error:', data.error);
        } else {
            console.log('Available Models:');
            if (data.models) {
                data.models.forEach((m: any) => console.log(`- ${m.name}`));
            } else {
                console.log('No models found or unexpected response:', data);
            }
        }
    } catch (error: any) {
        console.error('Network Error:', error.message);
    }
}

listModels();
