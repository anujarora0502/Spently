import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, expenses, history } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Missing prompt' }, { status: 400 });
    }

    if (!expenses || !Array.isArray(expenses)) {
      return NextResponse.json({ error: 'Missing expense data' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Generate a summarized version of expenses to avoid too many tokens
    // We only need basic fields to answer queries
    const simplifiedData = expenses.map(e => ({
      amount: e.amount,
      date: e.date,
      category: e.category,
      item: e.item
    }));

    const historyPrompt = history?.length > 0 ? 
      `\nPrevious conversation:\n${history.map((h: any) => `User: ${h.query}\nResponse: ${h.answer}`).join('\n')}\n` : '';

    const systemPrompt = `
      You are an intelligent financial assistant. The user is asking a question about their expenses.
      Here is the user's expense data in JSON format:
      ${JSON.stringify(simplifiedData)}
      ${historyPrompt}
      User's question: "${prompt}"
      
      Analyze the data to answer the user's question accurately.
      Respond ONLY with a valid JSON object matching this schema:
      {
        "answer": "A short, helpful, and exact text response answering the user's query."
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
    console.error("Error generating answer:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate answer' }, { status: 500 });
  }
}
