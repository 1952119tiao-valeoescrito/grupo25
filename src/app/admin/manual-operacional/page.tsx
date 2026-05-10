"use client"
import { ShieldCheck, Zap, Wallet, Cpu, Database, Award, Info, FileText, Printer, ChevronRight, RefreshCw, Landmark, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManualOperacionalAdmin() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#010409] text-white font-sans p-4 md:p-10 selection:bg-cyan-500/30 print:bg-white print:text-black">
      
      {/* BARRA DE FERRAMENTAS - INVISÍVEL NO PDF */}
      <div className="max-w-5xl mx-auto flex justify-between mb-8 no-print">
        <button onClick={() => router.back()} className="text-slate-500 hover:text-white flex items-center gap-2 text-xs font-black uppercase tracking-widest">
           <Landmark size={18}/> Voltar ao Comando
        </button>
        <button 
          onClick={() => window.print()}
          className="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-3 rounded-xl font-black uppercase text-xs flex items-center gap-2 transition-all shadow-lg"
        >
          <Printer size={18} /> Salvar Manual em PDF
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-slate-900/40 border-2 border-yellow-500/20 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden print:border-none print:shadow-none print:p-0">
        
        <header className="border-b border-yellow-500/30 pb-10 mb-12 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="bg-yellow-500 p-4 rounded-3xl shadow-[0_0_30px_rgba(234,179,8,0.3)] print:bg-black">
              <ShieldCheck className="text-black print:text-white" size={40} />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase text-yellow-500 print:text-black" style={{fontFamily: 'Orbitron'}}>
                MANUAL DO COMANDANTE
              </h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.4em] mt-2">Protocolos de Gestão Bet-Grupo25 v3.5</p>
            </div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl inline-block">
             <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest italic">⚠️ Documento de Acesso Restrito ao Administrador do Sistema</p>
          </div>
        </header>

        <main className="space-y-20 relative z-10">

          {/* 1. MONITORAMENTO SEMANAL */}
          <section>
            <h2 className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xl mb-8 italic">
              <Database size={24} /> 01. Monitoramento da Banca
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-white font-black text-xs uppercase mb-2 border-l-4 border-cyan-500 pl-3">Dashboard em Tempo Real</h4>
                <p className="text-sm leading-relaxed text-slate-300">Acompanhe diariamente o <strong>Total Arrecadado</strong> e o número de <strong>Tickets Pagos</strong>. Bilhetes com status "Pendente" são usuários que geraram o Pix mas ainda não pagaram.</p>
              </div>
              <div className="bg-black/40 p-8 rounded-3xl border border-white/5 space-y-4 text-justify">
                <h4 className="text-white font-black text-xs uppercase mb-2 border-l-4 border-cyan-500 pl-3">Verificação de Logs</h4>
                <p className="text-sm leading-relaxed text-slate-300 italic">Se o Pix parar de gerar para os clientes, verifique o painel da Vercel. O erro mais comum é o usuário tentando pagar o Pix usando o mesmo e-mail da conta recebedora do Mercado Pago.</p>
              </div>
            </div>
          </section>

          {/* 2. O RITUAL DO SORTEIO */}
          <section className="page-break">
            <h2 className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xl mb-8 italic">
              <Zap size={24} /> 02. O Ritual de Sábado (20:00h)
            </h2>
            <div className="bg-slate-950 p-8 md:p-12 rounded-[3rem] border-2 border-cyan-500/20 shadow-inner">
               <div className="space-y-10">
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center font-black text-white shrink-0">1</div>
                     <div>
                        <h4 className="text-white font-black uppercase text-sm mb-2">Acionamento Blockchain (Oficial)</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Abra a aba <strong>SORTEIO</strong> no painel. Clique em <strong>"Disparar VRF Blockchain"</strong>. Sua MetaMask abrirá: confirme a transação. O sistema levará cerca de 2 minutos para processar os ganhadores sozinho via Robô Render.</p>
                     </div>
                  </div>
                  <div className="flex gap-6 items-start">
                     <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center font-black text-white shrink-0">2</div>
                     <div>
                        <h4 className="text-white font-black uppercase text-sm mb-2">Protocolo de Contingência (Manual)</h4>
                        <p className="text-slate-400 text-sm leading-relaxed">Caso a rede Base Mainnet esteja instável, use o botão <strong>"Acionar Matrix Local"</strong>. Digite sua <strong>Secret Key</strong> e confirme. O sorteio e a auditoria de ganhadores serão feitos instantaneamente pelo servidor.</p>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          {/* 3. PAGAMENTOS (SAQUES) */}
          <section className="page-break">
            <h2 className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xl mb-8 italic">
              <Wallet size={24} /> 03. Procedimento de Payout (Manual)
            </h2>
            <div className="bg-black/60 p-10 rounded-[3rem] border border-yellow-500/30">
               <p className="text-white font-bold text-base mb-8 text-center uppercase tracking-tighter italic">Como você é o Tesoureiro da Matrix, siga este fluxo rigoroso:</p>
               <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-slate-500 font-black mb-4 uppercase">Passo 1</p>
                     <p className="text-xs font-bold text-white">Consulte a lista na aba <strong>FINANCEIRO</strong> para ver quem ganhou.</p>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-slate-500 font-black mb-4 uppercase">Passo 2</p>
                     <p className="text-xs font-bold text-white">Copie a <strong>Chave Pix Resgate</strong> e faça o envio pelo seu App do Banco.</p>
                  </div>
                  <div className="text-center p-6 bg-slate-900/50 rounded-2xl border border-white/5">
                     <p className="text-[10px] text-slate-500 font-black mb-4 uppercase">Passo 3</p>
                     <p className="text-xs font-bold text-white">Clique em <strong>"Validar Payout"</strong> no site para dar baixa no bilhete.</p>
                  </div>
               </div>
            </div>
          </section>

          {/* 4. REINICIALIZAÇÃO */}
          <section>
            <h2 className="flex items-center gap-3 text-cyan-400 font-black uppercase tracking-widest text-xl mb-8 italic">
              <RefreshCw size={24} /> 04. Iniciar Próxima Rodada
            </h2>
            <div className="bg-yellow-500/10 border-l-8 border-yellow-500 p-8 rounded-2xl">
               <p className="text-white font-black text-sm uppercase mb-4 tracking-widest">Protocolo de Limpeza de Ciclo</p>
               <p className="text-sm text-slate-300 leading-relaxed">Após concluir todos os pagamentos da rodada atual, vá na aba <strong>DASHBOARD</strong> e clique em <strong>"Abrir Próxima Rodada"</strong>. Isso criará o novo certame, resetará o cronômetro para 7 dias e zerará a arrecadação na tela principal.</p>
            </div>
          </section>

          {/* ALERTAS FINAIS */}
          <section className="bg-red-900/20 border-2 border-red-500/30 p-10 rounded-[3rem]">
             <h3 className="text-red-500 font-black uppercase italic mb-6 flex items-center gap-2"><AlertTriangle size={20}/> Atenção Comandante</h3>
             <ul className="space-y-4 text-xs font-bold uppercase text-white leading-relaxed">
                <li>• Mantenha sempre saldo de LINK na sua assinatura Chainlink.</li>
                <li>• Nunca revele sua ADMIN_SECRET_KEY para terceiros.</li>
                <li>• O robô da Render deve estar sempre com o status "LIVE" (Verde).</li>
             </ul>
          </section>

        </main>

        <footer className="mt-24 pt-10 border-t border-white/10 text-center">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.8em]">
            © 2026 BET-GRUPO25 | SISTEMA CRIPTOGRÁFICO ELITE V3.5
          </p>
        </footer>

      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&display=swap');
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          body { background: white !important; color: black !important; }
          h1, h2, h3, h4 { color: black !important; text-shadow: none !important; }
          p, b, span, li { color: #333 !important; }
        }
      `}</style>
    </div>
  );
}