import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chat
 * Multi-modal chatbot endpoint for solving student questions (text/image) using Gemini.
 */
export async function POST(req: NextRequest) {
  try {
    const { message, image } = await req.json();

    const apiKey = process.env.GEMINI_CHAT_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return NextResponse.json({ error: 'Gemini API key is not configured in .env.local.' }, { status: 500 });
    }

    const parts = [];

    // If an image (photo of the sum) is provided as base64 or Data URL
    if (image) {
      const match = image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
      let mimeType = 'image/jpeg';
      let base64Data = image;

      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }

      parts.push({
        inlineData: {
          mimeType,
          data: base64Data
        }
      });
    }

    // Add the text prompt
    parts.push({
      text: message || 'Please analyze and solve the question shown in the attached image step-by-step.'
    });

    const payload = {
      contents: [
        {
          role: 'user',
          parts
        }
      ],
      systemInstruction: {
        parts: [{
          text: "You are 'PaperPredictor AI Solver', a world-class math and science tutor for Indian board students (CBSE, ICSE, State Boards) and JEE/NEET aspirants. " +
                "Solve any question step-by-step, explaining the formulas and steps clearly. " +
                "Do NOT use complex LaTeX formulas. Write math symbols in plain text (e.g., use x^2 instead of x², sqrt(x) instead of √x, divide sign, or standard clean lines) so it's perfectly readable in a simple chat box. " +
                "Focus on providing accurate, conceptually sound explanations, not pre-fed answers."
        }]
      }
    };

    const modelConfig = process.env.LLM_MODEL || 'gemini-3.5-flash';
    const modelsToTry = [modelConfig, 'gemini-3.5-flash', 'gemini-flash-latest'];
    const uniqueModels = [...new Set(modelsToTry)];

    let reply = '';
    let lastErrorMsg = '';
    let success = false;

    for (const model of uniqueModels) {
      try {
        console.log(`[Chat API] Trying model: ${model}`);
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`Status ${response.status}: ${errText}`);
        }

        const resJson = await response.json();
        reply = resJson.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (reply) {
          success = true;
          break;
        }
      } catch (err) {
        console.warn(`[Chat API Warning] Model ${model} failed:`, err);
        lastErrorMsg = err instanceof Error ? err.message : String(err);
      }
    }

    if (!success) {
      console.error('[Chat API Error] All chat models failed. Last error:', lastErrorMsg);
      return NextResponse.json({ error: `AI Solver error: ${lastErrorMsg || 'No response from AI'}` }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('[Chat API Error]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
