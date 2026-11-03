import { NextRequest, NextResponse } from "next/server";
import { getMetaAI } from "@/lib/meta";

export async function POST(request: NextRequest) {
    try {
        const { text, language } = await request.json();

        if (!text || typeof text !== "string" || !text.trim()) {
            return NextResponse.json(
                { error: "Please provide text to explain." },
                { status: 400 }
            );
        }

        const supportedLanguages = [
            "Simple English",
            "Nigerian Pidgin",
            "Yoruba",
            "Hausa",
            "Igbo",
        ];

        if (!supportedLanguages.includes(language)) {
            return NextResponse.json(
                { error: "Unsupported language selected." },
                { status: 400 }
            );
        }

        if (text.length > 15000) {
            return NextResponse.json(
                { error: "Please submit a shorter document." },
                { status: 400 }
            );
        }

        const prompt = `
You are Explain Naija, an information accessibility assistant
built to help Nigerians understand complex public information.

Your task is to explain the supplied document in ${language}.

Return your entire response in ${language}.

Structure your response using these sections:

1. In Plain Words:
Explain the document simply and accurately.

2. Who Is Affected:
Identify the people or organisations affected.

3. Your Next Steps:
Provide practical steps based strictly on the document.

4. Important Dates:
Identify deadlines and dates explicitly mentioned.
If none exist, say so.

5. What Is Unclear:
Highlight information missing or ambiguous in the document.

IMPORTANT RULES:
- Do not invent facts, deadlines or requirements.
- Do not introduce eligibility conditions absent from the source.
- Preserve important names, figures and dates.
- Clearly distinguish facts from suggestions.
- If the document is unclear, acknowledge it.
- Use natural, understandable ${language}.

DOCUMENT:
<document>
${text}
</document>
`;

        // Initialise the Meta client only when the API is called.
        const metaAI = getMetaAI();

        const response = await metaAI.responses.create({
            model: "muse-spark-1.3",
            input: prompt,
        });

        return NextResponse.json({
            success: true,
            explanation: response.output_text,
            language,
            model: "muse-spark-1.3",
        });

    } catch (error) {
        console.error("Explain Naija API error:", error);

        return NextResponse.json(
            { error: "Unable to explain this document. Please try again." },
            { status: 500 }
        );
    }
}
