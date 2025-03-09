import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received request body:', body);

    if (!body.userInput) {
      return NextResponse.json({ error: 'No input provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
    }

    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: body.userInput }] }],
        }),
    });

    const data = await response.json();
    console.log('Gemini API Response:', data);

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'Failed to get response' }, { status: 500 });
    }

    const assistantReply = data.candidates?.[0]?.content?.parts?.map((part: { text: any; }) => part.text).join(' ') || 'Sorry, I couldn’t process that.';


    return NextResponse.json({ response: assistantReply });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
