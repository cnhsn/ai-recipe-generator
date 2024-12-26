import { NextResponse } from 'next/server';
import axios from 'axios';

interface OpenRouterResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    type?: string;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ingredients, cuisine, dietary, mealType } = body;

    // Check if required environment variables are set
    if (!process.env.AI_MODEL || !process.env.SYSTEM_PROMPT || !process.env.OPENROUTER_API_KEY) {
      console.error('Missing environment variables:', {
        hasModel: !!process.env.AI_MODEL,
        hasPrompt: !!process.env.SYSTEM_PROMPT,
        hasApiKey: !!process.env.OPENROUTER_API_KEY
      });
      throw new Error('Gerekli yapılandırma ayarları eksik.');
    }

    // Validate input
    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'En az bir malzeme girmelisiniz.' },
        { status: 400 }
      );
    }

    const response = await axios.post<OpenRouterResponse>(
      process.env.OPENROUTER_URL!,
      {
        model: process.env.AI_MODEL,
        messages: [
          {
            role: "system",
            content: process.env.SYSTEM_PROMPT
          },
          {
            role: "user",
            content: `Create a recipe with these details:
              ${ingredients ? `Ingredients: ${ingredients.join(', ')}` : ''}
              ${cuisine ? `Cuisine Type: ${cuisine}` : ''}
              ${dietary ? `Dietary Requirements: ${dietary}` : ''}
              ${mealType ? `Meal Type: ${mealType}` : ''}`
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
        }
      }
    );

    // Log the raw response for debugging
    console.log('API Response:', JSON.stringify(response.data, null, 2));

    // Check if response has error
    if (response.data.error) {
      throw new Error(response.data.error.message || 'API yanıtında hata var');
    }

    // Check if response has the expected format
    if (!response.data?.choices?.[0]?.message?.content) {
      console.error('Unexpected API response format:', response.data);
      throw new Error('API yanıtı beklenmeyen formatta');
    }

    const content = response.data.choices[0].message.content;

    // Validate content
    if (typeof content !== 'string' || content.trim().length === 0) {
      throw new Error('API geçersiz içerik döndürdü');
    }

    // Format the response to match OpenAI API format
    return NextResponse.json({
      choices: [{
        message: {
          content: content
        }
      }]
    });

  } catch (error: any) {
    console.error('Error generating recipe:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack
    });

    // Handle different types of errors
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return NextResponse.json(
          { error: 'API anahtarı geçersiz veya süresi dolmuş.' },
          { status: 401 }
        );
      }

      if (error.response?.status === 429) {
        return NextResponse.json(
          { error: 'API kullanım limiti aşıldı. Lütfen daha sonra tekrar deneyin.' },
          { status: 429 }
        );
      }

      if (error.response?.data?.error) {
        return NextResponse.json(
          { error: error.response.data.error },
          { status: error.response.status || 500 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: 'Tarif oluşturulurken bir hata oluştu.',
        details: error.message,
        type: error.name
      },
      { status: 500 }
    );
  }
} 