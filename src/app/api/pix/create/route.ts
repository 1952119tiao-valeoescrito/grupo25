import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const emailLimpo = body.email.trim().toLowerCase();
    const cpfLimpo = body.cpf ? body.cpf.replace(/[^0-9]/g, '') : '00000000000';

    // 1. Localizar o usuário logado
    const user = await prisma.user.findUnique({ where: { email: emailLimpo } });
    if (!user) return NextResponse.json({ error: "Sessão expirada. Logue novamente." }, { status: 401 });

    // 2. Criar o Bilhete no Neon
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: emailLimpo,
        chavePixPremio: body.pixKey || cpfLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
      }
    });

    // 3. Gerar Cobrança no Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { 
          email: emailLimpo, 
          identification: { type: 'CPF', number: cpfLimpo } 
        }
      }
    });

    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });

  } catch (e: any) { 
    console.error("ERRO MP:", e);
    return NextResponse.json({ error: "Token ou CPF inválido no Mercado Pago" }, { status: 500 }); 
  }
}
