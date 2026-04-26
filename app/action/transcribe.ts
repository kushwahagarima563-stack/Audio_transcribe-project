"use server"
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

export async function transcribeAudio(audioBuffer: Buffer, mimeType: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent([
    "Transcribe the following audio content exactly as spoken.",
    {
      inlineData: {
        data: audioBuffer.toString("base64"),
        mimeType: mimeType
      }
    }
  ]);

  const transcriptText = result.response.text();

  // Save to Database
  await prisma.transcript.create({
    data: {
      text: transcriptText,
      authorId: "admin-id-here" // Get this from your session
    }
  });

  return transcriptText;
}
