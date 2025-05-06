// app/api/documents/route.ts
import { NextRequest, NextResponse } from 'next/server';

const NEST_API_URL = process.env.NEST_API_URL || 'http://localhost:3001';

// GET /api/documents — lista todas as pastas e arquivos
export async function GET() {
  try {
    const res = await fetch(`${NEST_API_URL}/documents`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal error', message },
      { status: 500 },
    );
  }
}

// POST /api/documents — cria uma nova pasta
export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Folder name required' },
        { status: 400 },
      );
    }
    const res = await fetch(`${NEST_API_URL}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal error', message },
      { status: 500 },
    );
  }
}
