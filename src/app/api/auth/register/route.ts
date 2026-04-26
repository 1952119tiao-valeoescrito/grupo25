
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: { nome: body.nome, email: body.email, senha: body.senha, pixKey: body.pix }
    });
    return NextResponse.json(user);
  } catch (e) { return NextResponse.json({ error: "Erro ao cadastrar" }, { status: 400 }); }
}