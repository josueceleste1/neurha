import { NextRequest, NextResponse } from 'next/server';
const NEST = process.env.NEST_API_URL!;

export async function PATCH(request: NextRequest, { params }: { params: { folderId: string } }) {
  const { name } = await request.json();
  if (!name) return NextResponse.json({ error: 'Folder name required' }, { status: 400 });
  const res = await fetch(`${NEST}/documents/folders/${params.folderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function DELETE(_: NextRequest, { params }: { params: { folderId: string } }) {
  const res = await fetch(`${NEST}/documents/folders/${params.folderId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json({ error: err }, { status: res.status });
  }
  return NextResponse.json({ success: true });
} 