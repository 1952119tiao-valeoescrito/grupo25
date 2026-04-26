import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.create({
      data: {
        nome: body.nome,
        email: body.email,
        senha: body.password, // Em produção, use hash
        pixKey: body.pix,
        indicadoPor: body.indicado_por
      }
    });
    return NextResponse.json({ usuario_id: user.id, nome: user.nome });
  } catch (e) {
    return NextResponse.json({ error: "E-mail já cadastrado ou erro no banco" }, { status: 400 });
  }
}