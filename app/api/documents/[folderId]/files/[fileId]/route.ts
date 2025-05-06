import { NextRequest, NextResponse } from 'next/server';
const NEST = process.env.NEST_API_URL!;

export async function DELETE(
  _: NextRequest,
  { params }: { params: { folderId: string; fileId: string } }
) {
  const res = await fetch(
    `${NEST}/documents/${params.folderId}/files/${params.fileId}`,
    { method: 'DELETE' }
  );
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
