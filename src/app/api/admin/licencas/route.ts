import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) return NextResponse.json({ active: false }, { status: 400 });

    // Aqui o sistema busca no seu banco Neon se o contrato está pago
    // Por enquanto, vamos retornar sempre 'true' para o seu MVP
    // No futuro, faremos a busca por 'status' na tabela de licenciados
    return NextResponse.json({ 
      active: true, 
      clientName: "Concessionária Homologada",
      version: "3.5"
    });
  } catch (e) {
    return NextResponse.json({ active: false }, { status: 500 });
  }
}