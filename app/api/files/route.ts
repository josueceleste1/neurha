import { NextResponse } from 'next/server';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const savedFiles = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = join(UPLOAD_DIR, fileName);
        
        await writeFile(filePath, buffer);
        
        return {
          id: uuidv4(),
          name: file.name,
          size: formatFileSize(file.size),
          url: `/uploads/${fileName}`
        };
      })
    );

    return NextResponse.json({ files: savedFiles });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Error uploading files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { fileId, fileUrl } = await request.json();
    const fileName = fileUrl.split('/').pop();
    const filePath = join(UPLOAD_DIR, fileName);
    
    await unlink(filePath);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Error deleting file' },
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