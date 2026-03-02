import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, expenses } = body;

    if (!prompt || !expenses) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not configured on server' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    // Minimize the payload sent to AI by removing user_id and created_at to save tokens
    const minifiedExpenses = expenses.map((e: any) => ({
      amount: e.amount,
      date: e.date,
      category: e.category,
      item: e.item
    }));

    // Provide the current date so Gemini knows what "this month" or "today" is
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    const currentDateString = today.toISOString().split('T')[0];
    const currentMonthString = today.toLocaleString('default', { month: 'long', year: 'numeric' });

    const systemPrompt = `
      You are an expert data visualization assistant.
      The user will provide a dataset of their expenses and ask you to visualize it ("User Prompt").
      Your job is to analyze the user's prompt, process the raw dataset to extract the exact numbers needed, and output a JSON configuration for 'recharts'.
      
      Current Date Context: Today is ${currentDateString} (${currentMonthString}). If the user asks for "this month", filter ONLY by this specific month and year.
      
      Data format provided: Array of { amount, date (YYYY-MM-DD), category, item }
      
      You must respond ONLY with a JSON object in this exact schema, representing the processed data and the chart type:
      {
        "type": "bar" | "pie" | "line",
        "title": "A short, descriptive title",
        "data": [
          { "name": "Category A or Date X", "value": 1500 },
          { "name": "Category B or Date Y", "value": 3200 }
        ]
      }
      
      Rules:
      1. Choose the chart type that makes the most sense (e.g. 'pie' for breakdown, 'line' for trends over time, 'bar' for comparisons).
      2. If asking for trends over time, aggregate the values by date (or month).
      3. If asking for a breakdown, aggregate the values by category.
      4. Do the math accurately. Return only the aggregated results in the 'data' array.
      
      User Prompt: "${prompt}"
      Raw Data: ${JSON.stringify(minifiedExpenses)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const resultText = response.text || '';
    const chartConfig = JSON.parse(resultText);

    return NextResponse.json(chartConfig);
  } catch (error: any) {
    console.error("Error generating graph config:", error);
    return NextResponse.json({ error: error.message || 'Failed to generate graph' }, { status: 500 });
  }
}
