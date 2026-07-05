import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StockData } from '../types';
import { Send, Sparkles, MessageSquare, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CopilotChatProps {
  stock: StockData | null;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isPending: boolean;
  onClearChat: () => void;
  lang?: 'en' | 'ar';
  className?: string;
}

const QUICK_PROMPTS_EN = [
  {
    label: 'Analyze Setup 📊',
    text: 'What do you think of my current technical setup on this ticker? Highlight key risks.'
  },
  {
    label: 'Risk Plan 🛡️',
    text: 'Evaluate the Stop-Loss and Take-Profit locations for this ticker. Are they technically sound?'
  },
  {
    label: 'Trading Psychology 🧠',
    text: 'I feel anxious and tempted to chase this breakout. Give me psychological guidance.'
  },
  {
    label: 'Smart Money Concepts ⚡',
    text: 'Explain how the active Bullish/Bearish Order Blocks on this stock influence current order-flow.'
  }
];

const QUICK_PROMPTS_AR = [
  {
    label: 'تحليل الصفقة 📊',
    text: 'ما رأيك في الإعداد الفني الحالي لهذا السهم؟ حدد المخاطر والفرص الرئيسية.'
  },
  {
    label: 'خطة المخاطر 🛡️',
    text: 'قيم مستويات وقف الخسارة وجني الأرباح المحددة لهذا السهم. هل هي دقيقة ومحمية فنياً؟'
  },
  {
    label: 'نفسية التداول 🧠',
    text: 'أشعر بالقلق والخوف من فوات الفرصة (FOMO) وأرغب في ملاحقة السعر. وجهني نفسياً كمتداول خبير.'
  },
  {
    label: 'الأموال الذكية SMC ⚡',
    text: 'اشرح لي كيف تؤثر كتل الأوامر الصعودية/الهبوطية النشطة لهذا السهم على تدفق السيولة حالياً.'
  }
];

export default function CopilotChat({ stock, messages, onSendMessage, isPending, onClearChat, lang = 'ar', className }: CopilotChatProps) {
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isArabic = lang === 'ar';

  const quickPrompts = isArabic ? QUICK_PROMPTS_AR : QUICK_PROMPTS_EN;

  // Auto scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div 
      id="copilot-chat-container" 
      className={`flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden ${className || 'h-[550px]'}`}
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-950/80 border-b border-slate-800 p-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-600 text-white rounded-lg shadow-md shadow-indigo-500/10">
            <Sparkles size={16} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100" id="copilot-heading">
              {isArabic ? 'مرشد التداول بالذكاء الاصطناعي' : 'AI Veteran Trading Mentor'}
            </h3>
            <p className="text-[11px] text-indigo-400 font-medium">
              {isArabic ? 'خبرة عقود من حكمة الأسواق والمحاكاة الفنية' : 'Decades of Simulated Market Wisdom'}
            </p>
          </div>
        </div>

        <button
          onClick={onClearChat}
          className="p-1.5 hover:bg-slate-800/60 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
          title={isArabic ? 'مسح المحادثة' : 'Reset Conversation'}
          id="clear-chat-btn"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full max-w-xs mx-auto space-y-3">
            <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-full text-indigo-400">
              <MessageSquare size={24} />
            </div>
            <h4 className="text-sm font-medium text-slate-200">
              {isArabic ? 'استشر مرشدك المالي الخاص' : 'Consult your Live Mentor'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isArabic 
                ? 'اسألني عن المؤشرات الفنية، خطة إدارة المخاطر، كتل الأوامر الفعالة، أو التحكم النفسي والذاتي أثناء التداول المباشر.'
                : 'Ask me about indicators, risk management setups, order blocks, or psychological self-control during live trading.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {messages.map((m) => {
                const isAssistant = m.sender === 'assistant';
                return (
                  <motion.div
                    key={m.id}
                    id={`chat-msg-${m.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md border ${
                        isAssistant
                          ? 'bg-slate-950/80 border-slate-800/80 text-slate-200 rounded-tl-none'
                          : 'bg-indigo-600 border-indigo-500 text-white rounded-tr-none'
                      }`}
                    >
                      {/* Formatted Text wrapper */}
                      <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
                        {m.text}
                      </div>
                      <div className="text-[9px] mt-1.5 opacity-45 text-right font-mono">
                        {m.timestamp}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {isPending && (
          <div className="flex justify-start">
            <div className="bg-slate-950/80 border border-slate-800 text-slate-400 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2.5 shadow-md">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
              <span className="text-[11px] font-mono">
                {isArabic ? 'المرشد يصيغ حكمة التداول الفنية...' : 'Mentor is formulating wisdom...'}
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 pb-2 pt-1 border-t border-slate-800/40 bg-slate-950/30">
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 pt-1 select-none scrollbar-none">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(qp.text)}
              className="flex-shrink-0 text-[10px] bg-slate-800/50 hover:bg-slate-800 hover:text-indigo-300 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-800 transition-all font-medium"
              id={`quick-prompt-${i}`}
            >
              {qp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            stock 
              ? (isArabic ? `اسأل المرشد عن صفقة ${stock.symbol}...` : `Ask mentor about ${stock.symbol} setup...`)
              : (isArabic ? 'اسأل المرشد عن علم نفس التداول...' : 'Ask trading mentor about psychology...')
          }
          className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs text-slate-200 placeholder-slate-500 font-medium transition-colors"
          disabled={isPending}
          id="chat-input-field"
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/10"
          disabled={isPending || !inputText.trim()}
          id="send-message-btn"
        >
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
