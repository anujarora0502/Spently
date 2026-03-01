import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, apiKey } = body;

    if (!text || !apiKey) {
      return NextResponse.json({ error: 'Missing text or API Key' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
      You are an intelligent intent classification assistant for an expense tracking app.
      The user will provide a voice transcript ("User Input").
      Your job is to classify their intent into exactly ONE of two categories:
      
      1. "LOG_EXPENSE": The user is describing a transaction they made (e.g. "I spent 500 on coffee", "bought groceries for 1200 today").
      2. "SHOW_GRAPH": The user is asking to visualize their data, see a breakdown, or view a chart (e.g. "show me a pie chart", "what did I spend this month?", "graph my food expenses").
      3. "ANSWER_QUERY": The user is asking a specific question about an expense or a fact from their data that requires a text answer rather than a chart (e.g. "which item did I spend most on in feb 2026", "how much did I spend on Netflix", "when did I last buy groceries").
      
      User Input: "${text}"
      
      Respond ONLY with a valid JSON object matching this schema, nothing else:
      {
        "intent": "LOG_EXPENSE" | "SHOW_GRAPH" | "ANSWER_QUERY"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text || '';
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error classifying intent:", error);
    return NextResponse.json({ error: error.message || 'Failed to classify intent' }, { status: 500 });
  }
}
