// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Lê e valida o body
    const body = await request.json();
    console.log('[api/chat] request body:', body);
    const question = body.question;
    if (!question) {
      return NextResponse.json({ error: 'Pergunta não informada.' }, { status: 400 });
    }

    const apiUrl = 'http://localhost:3001/api/v1/rag/ask';
    console.log('[api/chat] forwarding to Nest API URL:', apiUrl);

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const text = await apiResponse.text();
    console.log('[api/chat] Nest API raw response:', text);
    const contentType = apiResponse.headers.get('content-type') || '';

    if (!apiResponse.ok) {
      let details: unknown;
      if (contentType.includes('application/json')) {
        try {
          details = JSON.parse(text);
        } catch {
          details = text;
        }
      } else {
        details = text;
      }
      console.error('[api/chat] Nest API retornou erro:', apiResponse.status, details);
      return NextResponse.json(
        { error: 'Erro na API LLM', details },
        { status: apiResponse.status }
      );
    }

    let answer: string;
    if (contentType.includes('application/json')) {
      try {
        const parsed = JSON.parse(text) as { answer?: unknown };
        if (typeof parsed.answer !== 'string') {
          throw new Error('Campo `answer` não encontrado ou inválido.');
        }
        answer = parsed.answer;
      } catch (parseErr) {
        console.error('[api/chat] Falha ao parsear JSON:', parseErr);
        return NextResponse.json(
          { error: 'Resposta JSON inválida da API LLM', raw: text },
          { status: 502 }
        );
      }
    } else {
      answer = text;
    }

    return NextResponse.json({ answer });
  } catch (err: unknown) {
    console.error('[api/chat] Erro interno:', err);
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro interno', message },
      { status: 500 }
    );
  }
}
