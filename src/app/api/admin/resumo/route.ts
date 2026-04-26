import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({ where: { pago: true } });
    const total = tickets.reduce((acc, t) => acc + 1000, 0);
    const count = await prisma.ticket.count({ where: { pago: true } });
    const last = await prisma.ticket.findMany({ take: 10, orderBy: { id: 'desc' } });
    return NextResponse.json({ total_valor: (total/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'}), total_contagem: count, ultimas_apostas: last });
  } catch (e) { return NextResponse.json({ error: "Erro" }, { status: 500 }); }
}