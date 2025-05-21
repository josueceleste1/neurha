import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');
    const name = formData.get('name') as string;
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      );
    }

    // Garante que o diretório de upload existe
    await mkdir(UPLOAD_DIR, { recursive: true });

    const uploadedFiles = await Promise.all(
      files.map(async (file: any) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Gera um ID único para o arquivo com timestamp
        const timestamp = Date.now();
        const fileId = `${uuidv4()}-${timestamp}`;
        // Remove caracteres especiais e espaços do nome do arquivo
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `${fileId}-${sanitizedName}`;
        const filePath = join(UPLOAD_DIR, fileName);

        // Salva o arquivo
        await writeFile(filePath, buffer);

        // Salva os metadados em um arquivo JSON separado
        const metadata = {
          name: name || file.name,
          category: category || 'Geral',
          description: description || '',
          type: file.type,
          size: buffer.length,
          uploadedAt: new Date().toISOString()
        };
        await writeFile(
          join(UPLOAD_DIR, `${fileId}.json`),
          JSON.stringify(metadata, null, 2)
        );

        console.log(metadata);

        return {
          id: fileId,
          name: name || file.name,
          category: category || 'Geral',
          description: description || '',
          size: formatFileSize(buffer.length),
          type: file.type,
          url: `/uploads/${fileName}`
        };
      })
    );

    return NextResponse.json({ files: uploadedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer upload dos arquivos' },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 