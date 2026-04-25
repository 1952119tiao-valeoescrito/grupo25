const fs = require('fs');
const { execSync } = require('child_process');

console.log("🛠️ Iniciando a super-correção de caminhos...");

// 1. Garantir que o arquivo src/lib/prisma.ts existe
if (!fs.existsSync('src/lib')) fs.mkdirSync('src/lib', { recursive: true });
const prismaLibContent = `
import { PrismaClient } from '@prisma/client';
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
`.trim();
fs.writeFileSync('src/lib/prisma.ts', prismaLibContent);
console.log("✅ Arquivo src/lib/prisma.ts verificado.");

// 2. Corrigir a API usando o alias @ (mais seguro)
const apiPath = 'src/app/api/pix/create/route.ts';
if (fs.existsSync(apiPath)) {
    const apiContent = `
import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { prisma } from '@/lib/prisma'; // Usando alias @

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
const payment = new Payment(client);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.create({
      data: {
        rodadaId: Number(body.rodadaId || 1),
        usuarioCpf: body.cpf,
        usuarioEmail: body.email,
        chavePixPremio: body.pixKey,
        prognosticos: JSON.stringify(body.prognosticos || []),
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
    console.log("✅ API atualizada para usar alias @/lib/prisma.");
}

// 3. Forçar a configuração do tsconfig.json para reconhecer o @
const tsconfig = {
  "compilerOptions": {
    "target": "ES2017",
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
    "plugins": [{ "name": "next" }],
    "baseUrl": ".", // Importante: define a raiz para o alias
    "paths": {
      "@/*": ["./src/*"] // Importante: mapeia o @ para a pasta src
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
console.log("✅ tsconfig.json reconfigurado com baseUrl e paths.");

// 4. Limpeza agressiva de cache
console.log("🧹 Limpando cache do Turbopack...");
if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
}

console.log("\n🚀 Tudo pronto! Agora rode: npm run dev");