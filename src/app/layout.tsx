import "./globals.css";
import Script from "next/script";
import { headers } from "next/headers";

export const metadata = {
  title: "G25 Tech Solutions | Engenharia de Software e Blockchain",
  description: "Licenciamento de tecnologia matricial híbrida para iGaming e Auditoria Blockchain.",
};

// --- SIMULAÇÃO DA TRAVA DE LICENÇA (KILL SWITCH) ---
// Em instalações para terceiros, este valor viria do banco de dados central
const IS_LICENSE_ACTIVE = true; 

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // Se a licença for desativada na nossa Central, o site do cliente "morre" aqui
  if (!IS_LICENSE_ACTIVE) {
    return (
      <html lang="pt-br">
        <body className="bg-[#010409] text-white flex items-center justify-center min-h-screen font-sans">
          <div className="text-center p-12 border-2 border-red-500/30 rounded-[3rem] shadow-2xl backdrop-blur-xl">
             <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-4xl">🔒</span>
             </div>
             <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Acesso Suspenso</h1>
             <p className="text-white text-sm font-bold opacity-80 leading-relaxed">
                Esta instância da Matrix Engine encontra-se temporariamente desativada <br/> por pendências administrativas de licenciamento.
             </p>
             <div className="mt-10 pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Entre em contato com a G25 TECH SOLUTIONS</p>
                <p className="text-cyan-400 font-bold mt-2">financeiro@g25tech.com.br</p>
             </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-br">
      <head>
        {/* 📊 GOOGLE ANALYTICS (GA4) - RESTAURADO */}
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
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}