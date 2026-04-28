import fs from 'fs';

const apiPath = 'src/app/api/pix/create/route.ts';

const apiContent = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. LIMPEZA DOS DADOS (O SEGREDO PARA O MP NÃO REJEITAR)
    const emailLimpo = body.email.trim().toLowerCase();
    const cpfLimpo = body.cpf ? body.cpf.replace(/[^0-9]/g, '') : '00000000000';

    // 2. BUSCAR OU CRIAR USUÁRIO NO BANCO
    let user = await prisma.user.findUnique({ where: { email: emailLimpo } });
    
    if (!user) {
        // Caso o usuário não exista no banco por algum reset, criamos agora
        user = await prisma.user.create({
            data: {
                nome: "Usuário Pix",
                email: emailLimpo,
                senha: "123",
                pixKey: cpfLimpo
            }
        });
    }

    // 3. CRIAR O BILHETE NO NEON
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: 1,
        userId: user.id,
        usuarioCpf: cpfLimpo,
        usuarioEmail: emailLimpo,
        chavePixPremio: cpfLimpo,
        prognosticos: JSON.stringify(body.prognosticos || []),
      }
    });

    // 4. CHAMADA AO MERCADO PAGO COM TRATAMENTO DE ERRO
    const mpRes = await payment.create({
      body: {
        transaction_amount: 10,
        description: "Aposta Bet-Grupo25 Matrix",
        payment_method_id: 'pix',
        external_reference: ticket.id,
        notification_url: process.env.NEXT_PUBLIC_URL + '/api/pix/webhook',
        payer: { 
          email: emailLimpo, 
          identification: { 
            type: 'CPF', 
            number: cpfLimpo 
          } 
        }
      }
    });

    return NextResponse.json({ 
        qrCode: mpRes.point_of_interaction?.qr_code, 
        ticketId: ticket.id 
    });

  } catch (e: any) { 
    // Isso aqui permite que você veja o erro real no log da Vercel
    console.error("❌ ERRO MERCADO PAGO DETALHADO:");
    if (e.api_response) console.error(JSON.stringify(e.api_response.body, null, 2));
    else console.error(e);

    return NextResponse.json({ 
        error: "Falha na comunicação com a API de Pagamentos" 
    }, { status: 500 }); 
  }
}
`.trim();

if (fs.existsSync(apiPath)) {
    fs.writeFileSync(apiPath, apiContent, { encoding: 'utf8' });
    console.log("✅ API de Pix corrigida com limpeza de dados e sem mexer no layout!");
} else {
    console.log("❌ Erro: Arquivo da API não encontrado.");