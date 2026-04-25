const fs = require('fs');

console.log("🔧 Aplicando correção definitiva de caminhos...");

// 1. Forçar a correção do arquivo de API com o caminho relativo infalível
const apiPath = 'src/app/api/pix/create/route.ts';
if (fs.existsSync(apiPath)) {
    const apiContent = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '../../../lib/prisma';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: body.rodadaId,
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
  } catch (e) { 
    console.error(e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 }); 
  }
}
`.trim();
    fs.writeFileSync(apiPath, apiContent);
    console.log("✅ Arquivo de API reescrito com caminho relativo.");
}

// 2. Configurar o tsconfig.json para aceitar o @/ (O que evita erros futuros)
const tsConfigPath = 'tsconfig.json';
const tsConfigContent = `
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
`.trim();
fs.writeFileSync(tsConfigPath, tsConfigContent);
console.log("✅ tsconfig.json configurado com atalhos @/*");

console.log("\n🧹 Limpando cache do Next.js...");
if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log("✅ Pasta .next removida (limpeza de cache).");
}

console.log("\n🚀 Tente rodar 'npm run dev' agora.");