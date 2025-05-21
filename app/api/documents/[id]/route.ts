import { NextRequest, NextResponse } from 'next/server';
import { unlink, readdir, access, mkdir, rename } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verifica se o diretório existe, se não, cria
    try {
      await access(UPLOAD_DIR);
    } catch (error) {
      console.log('Upload directory not found, creating...');
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    console.log('Searching for file with ID:', params.id);
    const files = await readdir(UPLOAD_DIR);
    console.log('Available files:', files);

    if (files.length === 0) {
      console.log('No files found in upload directory');
      return NextResponse.json(
        { error: 'Nenhum arquivo encontrado' },
        { status: 404 }
      );
    }

    const fileToDelete = files.find((f: string) => f === params.id);
    
    if (!fileToDelete) {
      console.log('File not found for ID:', params.id);
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    console.log('Found file to delete:', fileToDelete);
    const filePath = join(UPLOAD_DIR, fileToDelete);
    console.log('Full file path:', filePath);

    try {
      await unlink(filePath);
      console.log('File successfully deleted');
    } catch (unlinkError) {
      console.error('Error during file deletion:', unlinkError);
      return NextResponse.json(
        { error: 'Erro ao excluir arquivo do sistema' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Documento excluído com sucesso'
    });
  } catch (error) {
    console.error('Error in delete operation:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor ao deletar documento' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { error: 'Nome do documento é obrigatório' },
        { status: 400 }
      );
    }

    const files = await readdir(UPLOAD_DIR);
    const fileToRename = files.find((f: string) => f === params.id);

    if (!fileToRename) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      );
    }

    const oldPath = join(UPLOAD_DIR, fileToRename);
    const extension = fileToRename.split('.').pop();
    const newFileName = `${params.id.split('-').slice(0, 2).join('-')}-${name}.${extension}`;
    const newPath = join(UPLOAD_DIR, newFileName);

    await rename(oldPath, newPath);

    return NextResponse.json({
      success: true,
      message: 'Documento renomeado com sucesso',
      url: `/uploads/${newFileName}`
    });
  } catch (error) {
    console.error('Error renaming file:', error);
    return NextResponse.json(
      { error: 'Erro ao renomear documento' },
      { status: 500 }
    );
  }
} 