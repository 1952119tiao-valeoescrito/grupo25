import fs from 'fs';

const apiPath = 'src/app/api/pix/create/route.ts';

const code = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Limpeza rigorosa de dados
    const emailLimpo = body.email.trim().toLowerCase();
    const cpfLimpo = body.cpf ? body.cpf.replace(/[^0-9]/g, '') : '00000000000';

    // 2. Localizar token (Trim para remover espaços acidentais)
    const token = (process.env.MP_ACCESS_TOKEN || '').trim();
    const client = new MercadoPagoConfig({ accessToken: token });
    const payment = new Payment(client);

    // 3. Buscar usuário no Neon
    const user = await prisma.user.findUnique({ where: { email: emailLimpo } });
    if (!user) return NextResponse.json({ error: "Faça login novamente." }, { status: 401 });

    // 4. Criar o Bilhete (Ticket)
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: emailLimpo,
        chavePixPremio: user.pixKey || "N/A",
        prognosticos: JSON.stringify(body.prognosticos || []),
      }
    });

    // 5. Chamada ao Mercado Pago
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: {
          email: emailLimpo,
          identification: { 
            type: 'CPF', 
            number: cpfLimpo.length === 11 ? cpfLimpo : '00000000000' 
          }
        }
      }
    });

    return NextResponse.json({ 
      qrCode: mpRes.point_of_interaction?.qr_code, 
      ticketId: ticket.id 
    });

  } catch (e: any) {
    console.error("ERRO MERCADO PAGO:", e);
    // Retornamos o erro real da API para você ver na tela o que houve
    const erroReal = e.api_response?.body?.message || e.message || "Erro desconhecido";
    return NextResponse.json({ error: erroReal }, { status: 500 });
  }
}
`.trim();

fs.writeFileSync(apiPath, code, { encoding: 'utf8' });
console.log("✅ API de Pix recalibrada para aceitar dados reais!");