import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const AssistantView: React.FC = () => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: t(
          'assistantWelcome',
          '¡Hola! Soy Stella, tu asistente de astronomía de StellaWay. Puedo aconsejarte sobre telescopios, la observación del Gran Eclipse Solar 2026, fotografía de la Vía Láctea, o darte efemérides para tu ubicación. ¿En qué te ayudo hoy?'
        ),
        timestamp: 'Ahora'
      }
    ]);
  }, [language]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();
      const replyText = data.reply || 'No pude obtener respuesta. Comprueba tu conexión.';

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error fetching assistant response:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Ocurrió un error al consultar con el asistente estelar. Inténtalo de nuevo.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-4 md:px-8 max-w-4xl mx-auto w-full pt-20 md:pt-12 pb-28 md:pb-16 flex flex-col h-[calc(100vh-5rem)]">
      {/* Header */}
      <header className="py-4 border-b border-white/10 mb-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7C4DFF]/30 border border-[#FFD700]/40 flex items-center justify-center shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <span className="material-symbols-outlined text-[#FFD700] text-2xl">smart_toy</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">Stella AI Stargazing Assistant</h1>
            <p className="text-xs text-[#FFD700] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Gemini 3.6 Flash Powered
            </p>
          </div>
        </div>
      </header>

      {/* Preset Suggestion Pills */}
      <div className="flex flex-wrap gap-2 mb-4 shrink-0">
        <button
          onClick={() => handleSend('¿Qué necesito para ver el Eclipse Solar Total 2026 en Castellón?')}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#FEE685] hover:text-black border border-white/10 text-white/90 transition-all font-semibold cursor-pointer"
        >
          🌑 Consejos Eclipse 2026
        </button>
        <button
          onClick={() => handleSend('Recomiéndame un telescopio para espacio profundo en zonas Bortle 2')}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#FEE685] hover:text-black border border-white/10 text-white/90 transition-all font-semibold cursor-pointer"
        >
          🔭 Recomendación Telescopio
        </button>
        <button
          onClick={() => handleSend('¿Cómo puedo empezar en astrofotografía de la Vía Láctea?')}
          className="text-xs px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#FEE685] hover:text-black border border-white/10 text-white/90 transition-all font-semibold cursor-pointer"
        >
          📷 Astrofotografía Vía Láctea
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-[#FEE685] text-black font-extrabold rounded-br-none shadow-lg shadow-[#FEE685]/10'
                  : 'glass-panel text-white/95 border border-white/15 rounded-bl-none bg-[#2D1B4E]/80'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
              <span
                className={`block text-[10px] mt-2 text-right ${
                  m.role === 'user' ? 'text-black/70 font-semibold' : 'text-white/50'
                }`}
              >
                {m.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-white/70 text-xs p-3 glass-panel rounded-xl max-w-xs border border-white/10">
            <span className="material-symbols-outlined text-[#FFD700] animate-spin">progress_activity</span>
            Stella está consultando las efemérides...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0 bg-white/5 p-2 rounded-2xl border border-white/15 backdrop-blur-md"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre telescopios, constelaciones o el Eclipse 2026..."
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl bg-[#FEE685] text-black flex items-center justify-center disabled:opacity-40 hover:bg-white transition-all cursor-pointer font-extrabold"
        >
          <span className="material-symbols-outlined text-xl">send</span>
        </button>
      </form>
    </div>
  );
};
