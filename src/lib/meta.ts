// import OpenAI from "openai";

// const apiKey = process.env.MODEL_API_KEY;

// if (!apiKey) {
//     throw new Error("MODEL_API_KEY is not configured");
// }

// export const metaAI = new OpenAI({
//     baseURL: "https://api.meta.ai/v1",
//     apiKey,
// });

import OpenAI from "openai";

export function getMetaAI() {
    const apiKey = process.env.MODEL_API_KEY;

    if (!apiKey) {
        throw new Error("MODEL_API_KEY is not configured");
    }

    return new OpenAI({
        apiKey,
        baseURL: "https://api.meta.ai/v1",
    });
}
