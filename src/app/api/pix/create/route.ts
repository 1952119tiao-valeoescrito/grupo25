import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cpfLimpo = body.cpf.replace(/[^0-9]/g, '');

    // Buscamos o usuário pelo e-mail para pegar o ID dele
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return NextResponse.json({ error: "Usuário não logado" }, { status: 401 });

    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id, // O BILHETE AGORA TEM DONO!
        usuarioCpf: cpfLimpo,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos || []),
      }
    });

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        payer: { email: body.email, identification: { type: 'CPF', number: cpfLimpo } }
      }
    });

    return NextResponse.json({ qrCode: mpRes.point_of_interaction?.qr_code });
  } catch (e) { 
    return NextResponse.json({ error: "Falha na Matrix" }, { status: 500 }); 
  }
}
