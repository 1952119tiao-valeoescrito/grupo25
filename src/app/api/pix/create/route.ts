import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cpfLimpo = body.cpf.replace(/[^0-9]/g, '');

    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return NextResponse.json({ error: "Usuário não logado" }, { status: 401 });

    // Salva o Bilhete com as 25 coordenadas
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos), // Salva a malha 5x5
      }
    });

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Bilhete Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { email: body.email, identification: { type: 'CPF', number: cpfLimpo } }
      }
    });

    // Retorna o QR Code e o ID do bilhete para o redirecionamento
    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });
  } catch (e) { 
    console.error(e);
    return NextResponse.json({ error: "Erro ao processar" }, { status: 500 }); 
  }
}