import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: 'Missing text' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Provide the current date so Gemini knows what "today" is
    const today = new Date();
    // Adjust to local date formatting broadly via simple timezone offset application
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const currentDateString = today.toISOString().split('T')[0];

    const prompt = `
      You are an intelligent expense parsing assistant.
      Extract the following information from the user's input:
      - amount (a number)
      - item (what they bought)
      - category (a short, standard budgeting category like Food, Transport, Utilities, Entertainment, etc.)
      - date (Format as YYYY-MM-DD. Assume the current year or month if ambiguous. If they say "today" or don't specify a date, output today's date: ${currentDateString})

      User Input: "${text}"

      Respond ONLY with a valid JSON object matching this schema, nothing else:
      {
        "amount": 100,
        "item": "Coffee",
        "category": "Food & Dining",
        "date": "2026-03-01"
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text || '';
    const parsedData = JSON.parse(resultText);

    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error("Error parsing expense:", error);
    return NextResponse.json({ error: error.message || 'Failed to parse expense' }, { status: 500 });
  }
}
