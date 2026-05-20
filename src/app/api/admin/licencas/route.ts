import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    if (!clientId) {
      return NextResponse.json({ active: false }, { status: 400 });
    }

    // Retorno simplificado para o MVP do Showroom
    return NextResponse.json({ 
      active: true, 
      clientName: "SFCHAGASFILHO OFICIAL",
      version: "3.5"
    });
  } catch (e) {
    return NextResponse.json({ active: false }, { status: 500 });
  }
}