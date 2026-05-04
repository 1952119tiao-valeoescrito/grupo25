import "./globals.css";
import Script from "next/script"; // Importação necessária para o Google Analytics

export const metadata = {
  title: "Bet-Grupo25 Oficial",
  description: "Loteria Híbrida Web3",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        {/* CONFIGURAÇÃO GOOGLE ANALYTICS (GA4) - ID: G-J713708T50 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-J713708T50"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J713708T50', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}