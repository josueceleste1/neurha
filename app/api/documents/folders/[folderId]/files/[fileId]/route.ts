import { NextRequest, NextResponse } from 'next/server';
const NEST = process.env.NEST_API_URL!;

export async function DELETE(
  request: NextRequest,
  { params }: { params: { folderId: string; fileId: string } }
) {
  try {
    const res = await fetch(`${NEST}/documents/folders/${params.folderId}/files/${params.fileId}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json({ error: err }, { status: res.status });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar arquivo' },
      { status: 500 }
    );
  }
} 