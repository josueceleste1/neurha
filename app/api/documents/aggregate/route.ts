// src/app/api/documents/[id]/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const folderId = params.id;
  try {
    const formData = await request.formData();

    // ==== LOG: inspeção do formData ====
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`formData[${key}] = File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`formData[${key}] =`, value);
      }
    }

    const files = formData.getAll('files') as File[];
    const name = formData.get('name')?.toString() || '';
    const category = formData.get('category')?.toString() || '';
    const description = formData.get('description')?.toString() || '';

    if (!files.length) {
      return NextResponse.json({ error: 'Nenhum arquivo enviado' }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();
        const fileId = `${uuidv4()}-${timestamp}`;
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-]/g, '_');
        const fileName = `${fileId}-${sanitizedName}`;
        const filePath = join(UPLOAD_DIR, fileName);

        await writeFile(filePath, buffer);

        // salva JSON de metadata
        const metadata = {
          name: name || file.name,
          category: category || 'Geral',
          description: description || '',
          type: file.type,
          size: buffer.length,
          uploadedAt: new Date().toISOString(),
        };
        await writeFile(
          join(UPLOAD_DIR, `${fileId}.json`),
          JSON.stringify(metadata, null, 2)
        );

        console.log('Arquivo salvo em disco com metadata:', metadata);

        return {
          url: `/uploads/${fileName}`,
          originalName: file.name,
        };
      })
    );

    // ==== LOG: payload que vamos enviar ao NestJS ====
    console.log('Payload para backend NestJS:', uploadedFiles);

    // chama o endpoint NestJS para persistir os metadados
    const res = await fetch(
      `${BACKEND_URL}/documents/${folderId}/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uploadedFiles),
      }
    );
    const backendResult = await res.json();
    console.log('Resposta do backend NestJS:', backendResult);

    return NextResponse.json({ 
      local: uploadedFiles, 
      backend: backendResult 
    });
  } catch (err) {
    console.error('Error no handler de upload Next.js:', err);
    return NextResponse.json(
      { error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return +(bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}
