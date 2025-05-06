import { NextRequest, NextResponse } from 'next/server';

const NEST = process.env.NEST_API_URL!; 
// aqui NEST deve ser só o host do Nest, ex: http://localhost:3001/api/v1

export async function POST(
  request: NextRequest,
  { params }: { params: { folderId: string } }
) {
  const form = await request.formData();
  const files = form.getAll('files');
  const fd = new FormData();
  files.forEach(f => fd.append('files', f as Blob));

  // **aqui** o path correto é `…/documents/:id/upload`
  const res = await fetch(
    `${NEST}/documents/${params.folderId}/upload`,
    { method: 'POST', body: fd }
  );

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
