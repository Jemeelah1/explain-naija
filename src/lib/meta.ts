import OpenAI from "openai";

const apiKey = process.env.MODEL_API_KEY;

if (!apiKey) {
    throw new Error("MODEL_API_KEY is not configured");
}

export const metaAI = new OpenAI({
    baseURL: "https://api.meta.ai/v1",
    apiKey,
});
