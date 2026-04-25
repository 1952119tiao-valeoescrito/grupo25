import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // LIMPEZA DO CPF: Remove pontos e traços para o Mercado Pago não dar erro
    const cpfLimpo = body.cpf.replace(/[^0-9]/g, '');

    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: Number(body.rodadaId || 1),
        usuarioCpf: cpfLimpo,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey,
        prognosticos: JSON.stringify(body.prognosticos || ["1/1"]),
      }
    });

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        // O Mercado Pago exige um e-mail válido do pagador
        payer: { 
          email: body.email, 
          identification: { 
            type: 'CPF', 
            number: cpfLimpo 
          } 
        }
      }
    });

    console.log("✅ PIX Gerado com Sucesso!");
    return NextResponse.json({ qrCode: mpRes.point_of_interaction?.qr_code, id: ticket.id });

  } catch (e: any) { 
    // LOG DETALHADO NO TERMINAL PARA VOCÊ VER O ERRO REAL
    console.error("❌ ERRO MERCADO PAGO:");
    if (e.cause) console.error(JSON.stringify(e.cause, null, 2));
    else console.error(e);

    return NextResponse.json({ error: "Erro na API do Mercado Pago" }, { status: 500 }); 
  }
}