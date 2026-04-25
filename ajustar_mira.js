const fs = require('fs');
const path = require('path');

console.log("🎯 Ajustando a mira dos arquivos...");

// 1. Corrigir o arquivo de API (Caminho Relativo Real)
const apiPath = 'src/app/api/pix/create/route.ts';
if (fs.existsSync(apiPath)) {
    const apiContent = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
// Subindo 4 níveis: create(1) -> pix(2) -> api(3) -> app(4) -> lib/prisma
import { prisma } from '../../../../lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: Number(body.rodadaId),
        usuarioCpf: body.cpf,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey,
        prognosticos: JSON.stringify(body.prognosticos),
      }
    });

    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { email: body.email, identification: { type: 'CPF', number: body.cpf } }
      }
    });

    return NextResponse.json({ qrCode: mpRes.point_of_interaction?.qr_code, id: ticket.id });
  } catch (e: any) { 
    console.error("Erro na API:", e);
    return NextResponse.json({ error: e.message || "Erro interno" }, { status: 500 }); 
  }
}
`.trim();
    fs.writeFileSync(apiPath, apiContent);
    console.log("✅ Caminho corrigido para: ../../../../lib/prisma");
}

// 2. Limpar cache para forçar a nova leitura
if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log("🧹 Cache .next limpo.");
}

console.log("\n🚀 Agora rode 'npm run dev' e tente gerar o PIX novamente.");