import "./globals.css";
import Script from "next/script";
import { Inter, Orbitron } from "next/font/google";

// 🚀 Configuração de Fontes Padrão de Elite
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter" 
});

const orbitron = Orbitron({ 
  subsets: ["latin"], 
  variable: "--font-orbitron" 
});

export const metadata = {
  title: "G25 Tech Solutions | Engenharia de Software e Blockchain",
  description: "Licenciamento de tecnologia matricial híbrida para iGaming e Auditoria Blockchain.",
};

// ==========================================================
// 🛡️ PROTOCOLO DE SEGURANÇA G25 (KILL SWITCH)
// ==========================================================
const IS_LICENSE_ACTIVE = true; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Caso a licença seja desativada, exibe a tela de bloqueio
  if (!IS_LICENSE_ACTIVE) {
    return (
      <html lang="pt-br" className={orbitron.variable}>
        <body className="bg-[#010409] text-white flex items-center justify-center min-h-screen p-6 text-center">
          <div className="p-12 border-2 border-red-500/30 rounded-[3rem] shadow-2xl backdrop-blur-xl max-w-md">
             <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                <span className="text-4xl">🔒</span>
             </div>
             <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4" style={{ fontFamily: 'var(--font-orbitron)' }}>
                Acesso Suspenso
             </h1>
             <p className="text-white text-sm font-bold opacity-80 leading-relaxed uppercase">
                Esta instância da Matrix Engine encontra-se desativada por pendências de licenciamento.
             </p>
             <div className="mt-10 pt-6 border-t border-white/10 text-[10px] text-slate-500 uppercase font-black tracking-widest">
                financeiro@g25tech.com.br
             </div>
          </div>
        </body>
      </html>
    );
  }

  // --- FLUXO NORMAL DO SITE (COM ANALYTICS ATIVO) ---
  return (
    <html lang="pt-br" className={`${inter.variable} ${orbitron.variable}`}>
      <body className="antialiased">
        {/* 📊 GOOGLE ANALYTICS (GA4 & GTM) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J713708T50"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J713708T50');
            gtag('config', 'GT-TWZSDS37');
          `}
        </Script>

        {children}
      </body>
    </html>
  );
}