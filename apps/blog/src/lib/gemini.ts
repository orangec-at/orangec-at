
import { GoogleGenAI } from "@google/genai";

type ChatHistoryItem = {
  role: "user" | "model";
  content: string;
};

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Missing GEMINI_API_KEY environment variable");
}

const ai = new GoogleGenAI({ apiKey: apiKey ?? "" });

const DEFAULT_MODEL = "gemini-1.5-flash";

export async function generateChatResponse(
  message: string,
  history: ChatHistoryItem[] = []
): Promise<string> {
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const chat = ai.chats.create({
    model: DEFAULT_MODEL,
    history: history.map((item) => ({
      role: item.role,
      parts: [{ text: item.content }],
    })),
    config: {
      maxOutputTokens: 1000,
    },
  });

  const response = await chat.sendMessage({ message });
  return response.text ?? "";
}
