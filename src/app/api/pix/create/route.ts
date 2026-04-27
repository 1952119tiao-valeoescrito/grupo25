import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body.email;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

    // Criar o Ticket no Neon
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: user.pixKey || "00000000000",
        usuarioEmail: user.email,
        chavePixPremio: user.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos),
        pago: false
      }
    });

    // Criar o Pix no Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Bilhete Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { 
          email: user.email,
          identification: { type: 'CPF', number: user.pixKey.replace(/[^0-9]/g, '') || '00000000000' }
        }
      }
    });

    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO API PIX:", e);
    return NextResponse.json({ error: e.message || "Erro no processamento" }, { status: 500 });
  }
}