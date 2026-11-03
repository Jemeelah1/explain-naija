import { NextRequest, NextResponse } from "next/server";
import { extractText as extractPdfText } from "unpdf";
import mammoth from "mammoth";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_CHARACTER_LIMIT = 15000;

function validateFileType(
  buffer: Buffer,
  fileName: string
): "pdf" | "docx" | "txt" | null {
  const lowerName = fileName.toLowerCase();

  if (lowerName.endsWith(".pdf")) {
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46
    ) {
      return "pdf";
    }
    return null;
  }

  if (lowerName.endsWith(".docx")) {
    if (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      buffer[2] === 0x03 &&
      buffer[3] === 0x04
    ) {
      return "docx";
    }
    return null;
  }

  if (lowerName.endsWith(".txt")) {
    const checkLength = Math.min(buffer.length, 1024);
    for (let i = 0; i < checkLength; i++) {
      if (buffer[i] === 0) {
        return null;
      }
    }
    return "txt";
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No document provided. Please select a file to upload." },
        { status: 400 }
      );
    }

    if (file.size === 0) {
      return NextResponse.json(
        { error: "The uploaded file is empty. Please upload a document with text content." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(
            2
          )}MB). Please upload a smaller document.`,
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const detectedType = validateFileType(buffer, file.name);

    if (!detectedType) {
      return NextResponse.json(
        {
          error:
            "Unsupported or invalid file format. Please upload a valid PDF (.pdf), Microsoft Word (.docx), or plain text (.txt) document.",
        },
        { status: 400 }
      );
    }

    let extractedText = "";

    if (detectedType === "pdf") {
      try {
        const result = await extractPdfText(new Uint8Array(buffer), {
          mergePages: true,
        });
        extractedText = typeof result.text === "string" ? result.text : String(result.text || "");
      } catch (pdfErr) {
        console.error("PDF extraction error:", pdfErr);
        return NextResponse.json(
          {
            error:
              "Unable to read text from this PDF. It may be encrypted, corrupted, or an image-only scan without selectable text.",
          },
          { status: 422 }
        );
      }
    } else if (detectedType === "docx") {
      try {
        const result = await mammoth.extractRawText({ buffer });
        extractedText = result.value || "";
      } catch (docxErr) {
        console.error("DOCX extraction error:", docxErr);
        return NextResponse.json(
          {
            error:
              "Unable to read this Word document. Please ensure it is a valid .docx file.",
          },
          { status: 422 }
        );
      }
    } else if (detectedType === "txt") {
      try {
        let textContent = buffer.toString("utf-8");
        if (textContent.charCodeAt(0) === 0xfeff) {
          textContent = textContent.slice(1);
        }
        extractedText = textContent;
      } catch (txtErr) {
        console.error("TXT extraction error:", txtErr);
        return NextResponse.json(
          {
            error:
              "Unable to decode this text file. Please ensure it uses standard UTF-8 or ASCII encoding.",
          },
          { status: 422 }
        );
      }
    }

    const cleanedText = extractedText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/[ \t]+/g, " ")
      .trim();

    if (!cleanedText || cleanedText.length < 5) {
      return NextResponse.json(
        {
          error:
            "No readable text could be extracted from this document. Please ensure your document contains textual content and not only images.",
        },
        { status: 422 }
      );
    }

    let finalText = cleanedText;
    let isTruncated = false;

    if (cleanedText.length > MAX_CHARACTER_LIMIT) {
      finalText = cleanedText.slice(0, MAX_CHARACTER_LIMIT);
      isTruncated = true;
    }

    return NextResponse.json({
      success: true,
      text: finalText,
      fileName: file.name,
      fileSize: file.size,
      fileType: detectedType,
      characterCount: finalText.length,
      originalCharacterCount: cleanedText.length,
      isTruncated,
    });
  } catch (err) {
    console.error("Document extraction error:", err);
    return NextResponse.json(
      { error: "Failed to process document. Please try again or copy and paste the text." },
      { status: 500 }
    );
  }
}
