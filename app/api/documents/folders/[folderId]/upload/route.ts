import { NextRequest, NextResponse } from 'next/server';
const NEST = process.env.NEST_API_URL!;

export async function POST(request: NextRequest, { params }: { params: { folderId: string } }) {
  try {
    const formData = await request.formData();
    const res = await fetch(`${NEST}/documents/folders/${params.folderId}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload do arquivo' },
      { status: 500 }
    );
  }
} 