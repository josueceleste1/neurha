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

    // Define URL do back-end NestJS (pode vir via .env local)
    const apiUrl = process.env.NEST_API_URL || 'http://localhost:3001/api/v1/rag/ask';
    console.log('[api/chat] forwarding to Nest API URL:', apiUrl);

    // Chama o serviço NestJS
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    // Obtém o texto da resposta
    const text = await apiResponse.text();
    console.log('[api/chat] Nest API raw response:', text);
    const contentType = apiResponse.headers.get('content-type') || '';

    if (!apiResponse.ok) {
      // Em caso de erro, tenta parsear JSON para detalhes ou retorna raw text
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

    // Com sucesso: trata como JSON ou plain text
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
      // Plain text response
      answer = text;
    }

    // Retorna a resposta do bot
    return NextResponse.json({ answer });
  } catch (err: unknown) {
    // Erro interno
    console.error('[api/chat] Erro interno:', err);
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return NextResponse.json(
      { error: 'Erro interno', message },
      { status: 500 }
    );
  }
}
