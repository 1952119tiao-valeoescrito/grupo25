
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user || user.senha !== body.senha) return NextResponse.json({ error: "Inválido" }, { status: 401 });
    return NextResponse.json(user);
  } catch (e) { return NextResponse.json({ error: "Erro" }, { status: 500 }); }
}