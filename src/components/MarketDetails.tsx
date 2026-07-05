import React from 'react';
import { StockData } from '../types';
import { Shield, Target, AlertCircle, TrendingUp, TrendingDown, Layers, Gauge } from 'lucide-react';

interface MarketDetailsProps {
  stock: StockData;
  lang?: 'en' | 'ar';
}

export default function MarketDetails({ stock, lang = 'ar' }: MarketDetailsProps) {
  const { signal, indicators, smartMoney } = stock;
  const isBullish = signal.type.includes('BUY');
  const isBearish = signal.type.includes('SELL');
  const isArabic = lang === 'ar';

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-3 gap-6" 
      id="market-details-section"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      
      {/* Column 1: Actionable Trading Signal & Risk Management */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2">
              <Shield size={16} className="text-indigo-400" /> 
              {isArabic ? 'إشارة الاستراتيجية الفعالة' : 'Actionable Strategy Signal'}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono ${
              isBullish ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
              isBearish ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
              'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {signal.timestamp}
            </span>
          </div>

          {/* Large Alert Callout */}
          <div className={`p-4 rounded-xl border mb-4 text-center ${
            isBullish ? 'bg-emerald-500/5 border-emerald-500/20' : 
            isBearish ? 'bg-rose-500/5 border-rose-500/20' : 
            'bg-slate-950/40 border-slate-800'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
              {isArabic ? 'تصنيف تفعيل الإشارة' : 'Trigger Rating'}
            </span>
            <span className={`text-xl font-black tracking-tight ${
              signal.type.includes('STRONG_BUY') ? 'text-emerald-400' :
              signal.type === 'BUY' ? 'text-emerald-500' :
              signal.type.includes('STRONG_SELL') ? 'text-rose-400' :
              signal.type === 'SELL' ? 'text-rose-500' :
              'text-slate-300'
            }`}>
              {isArabic 
                ? (signal.type === 'STRONG_BUY' ? 'شراء قوي' : signal.type === 'BUY' ? 'شراء' : signal.type === 'STRONG_SELL' ? 'بيع قوي' : 'بيع')
                : signal.type.replace('_', ' ')}
            </span>
            <p className="text-[11px] text-slate-400 mt-2 italic leading-relaxed">
              "{signal.setup}"
            </p>
          </div>

          {/* Trade parameters list */}
          {(() => {
            const decimals = signal.riskManagement.entry < 5 ? 4 : 2;
            return (
              <div className="space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Target size={12} className="text-indigo-400" /> 
                    {isArabic ? 'الدخول المقترح' : 'Suggested Entry'}
                  </span>
                  <span className="text-slate-200 font-bold" dir="ltr">${signal.riskManagement.entry.toFixed(decimals)}</span>
                </div>

                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <AlertCircle size={12} className="text-rose-400" /> 
                    {isArabic ? 'وقف الخسارة (SL)' : 'Stop-Loss (SL)'}
                  </span>
                  <span className="text-rose-400 font-bold" dir="ltr">${signal.riskManagement.stopLoss.toFixed(decimals)}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    {isArabic ? 'أهداف جني الأرباح (TP)' : 'Target Take Profit Zones'}
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500">TP1 (1.2R)</div>
                      <div className="text-emerald-400 font-bold" dir="ltr">${signal.riskManagement.takeProfit1.toFixed(decimals)}</div>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500">TP2 (2.0R)</div>
                      <div className="text-emerald-400 font-bold" dir="ltr">${signal.riskManagement.takeProfit2.toFixed(decimals)}</div>
                    </div>
                    <div className="bg-slate-950/40 border border-slate-800/80 rounded-lg p-2 text-center">
                      <div className="text-[9px] text-slate-500">TP3 (3.5R)</div>
                      <div className="text-emerald-400 font-bold" dir="ltr">${signal.riskManagement.takeProfit3.toFixed(decimals)}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Risk-Reward visual gauge */}
        <div className="mt-4 pt-3 border-t border-slate-800/40">
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-400">{isArabic ? 'نسبة العائد إلى المخاطر' : 'Risk-to-Reward Ratio'}</span>
            <span className="text-indigo-400 font-bold" dir="ltr">{signal.riskManagement.riskRewardRatio}:1</span>
          </div>
          <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex">
            <div className="h-full bg-rose-500/80" style={{ width: '25%' }} title="Risk Zone" />
            <div className="h-full bg-emerald-500/80 flex-1" title="Reward Zone" style={{ width: '75%' }} />
          </div>
        </div>
      </div>

      {/* Column 2: Technical Indicators Engine */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
        <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2 mb-4">
          <Gauge size={16} className="text-indigo-400" /> 
          {isArabic ? 'التقاء المؤشرات الفنية' : 'Tech Indicator Confluence'}
        </h3>

        {/* RSI Meter */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-mono mb-1.5">
            <span className="text-slate-400">{isArabic ? 'مؤشر القوة النسبية (RSI-14)' : 'Relative Strength Index (RSI-14)'}</span>
            <span className={`font-bold ${indicators.rsi < 35 ? 'text-emerald-400' : indicators.rsi > 65 ? 'text-rose-400' : 'text-indigo-300'}`}>
              {indicators.rsi} ({
                isArabic 
                  ? (indicators.rsi < 35 ? 'تشبع بيعي' : indicators.rsi > 65 ? 'تشبع شرائي' : 'محايد')
                  : (indicators.rsi < 35 ? 'Oversold' : indicators.rsi > 65 ? 'Overbought' : 'Neutral')
              })
            </span>
          </div>
          <div className="relative h-2 w-full bg-slate-950 rounded-full border border-slate-800">
            {/* Limit bars */}
            <div className="absolute left-[30%] right-[30%] top-0 bottom-0 border-l border-r border-slate-800 bg-slate-900/30" />
            {/* Active pointer */}
            <div 
              className="absolute h-3.5 w-3.5 bg-indigo-500 rounded-full border-2 border-slate-950 -top-[3px] shadow-lg shadow-indigo-500/50 transition-all duration-300"
              style={{ left: `${Math.max(0, Math.min(100, indicators.rsi))}%`, transform: 'translateX(-50%)' }}
            />
          </div>
          <div className="flex justify-between text-[8px] text-slate-500 font-mono mt-1 px-1">
            <span>{isArabic ? 'تشبع بيعي (30)' : 'OVERSOLD (30)'}</span>
            <span>{isArabic ? 'متوسط' : 'MID'}</span>
            <span>{isArabic ? 'تشبع شرائي (70)' : 'OVERBOUGHT (70)'}</span>
          </div>
        </div>

        {/* MACD Data */}
        <div className="mb-4 bg-slate-950/40 border border-slate-800/80 rounded-xl p-3 font-mono text-xs">
          <div className="text-[10px] text-slate-500 uppercase mb-2">
            {isArabic ? 'تقاطع مؤشر الماكد (MACD 12, 26, 9)' : 'MACD (12, 26, 9) Signal Cross'}
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[9px] text-slate-400">{isArabic ? 'خط الماكد' : 'MACD Line'}</div>
              <div className={`font-bold ${indicators.macd.macdLine >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {indicators.macd.macdLine}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">{isArabic ? 'خط الإشارة' : 'Signal Line'}</div>
              <div className="text-slate-300 font-bold">{indicators.macd.signalLine}</div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400">{isArabic ? 'الأعمدة' : 'Histogram'}</div>
              <div className={`font-bold ${indicators.macd.histogram >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {indicators.macd.histogram}
              </div>
            </div>
          </div>
        </div>

        {/* EMAs Profile */}
        <div className="space-y-2 text-xs font-mono">
          <div className="text-[10px] text-slate-500 uppercase mb-1">{isArabic ? 'المتوسطات المتحركة الأسية' : 'Exponential Moving Averages'}</div>
          <div className="flex justify-between items-center py-1 bg-slate-950/20 px-2 rounded-lg border border-slate-800/30">
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> EMA 20
            </span>
            <span className="text-slate-300 font-semibold" dir="ltr">${indicators.ema20}</span>
          </div>
          <div className="flex justify-between items-center py-1 bg-slate-950/20 px-2 rounded-lg border border-slate-800/30">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> EMA 50
            </span>
            <span className="text-slate-300 font-semibold" dir="ltr">${indicators.ema50}</span>
          </div>
          <div className="flex justify-between items-center py-1 bg-slate-950/20 px-2 rounded-lg border border-slate-800/30">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 bg-slate-500 rounded-full" /> EMA 200
            </span>
            <span className="text-slate-300 font-semibold" dir="ltr">${indicators.ema200}</span>
          </div>
        </div>
      </div>

      {/* Column 3: Smart Money Concepts (SMC) & Liquidity pools */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-slate-200 uppercase flex items-center gap-2 mb-4">
            <Layers size={16} className="text-indigo-400" /> 
            {isArabic ? 'مفاهيم الأموال الذكية (SMC)' : 'Smart Money Concepts'}
          </h3>

          {/* Active Order Blocks */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 font-mono text-xs">
              <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <TrendingUp size={10} /> 
                {isArabic ? 'كتل الشراء (طلب)' : 'Bullish OB (Demand)'}
              </div>
              <div className="space-y-1">
                {smartMoney.bullishOrderBlocks.map((ob, i) => (
                  <div key={i} className="flex justify-between text-[11px] text-emerald-300/90" dir="ltr">
                    <span>${ob.price}</span>
                    <span className="opacity-50">{isArabic ? 'حجم:' : 'Vol:'}{Math.round(ob.volume/1000)}k</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 font-mono text-xs">
              <div className="text-[9px] text-rose-400 font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <TrendingDown size={10} /> 
                {isArabic ? 'كتل البيع (عرض)' : 'Bearish OB (Supply)'}
              </div>
              <div className="space-y-1">
                {smartMoney.bearishOrderBlocks.map((ob, i) => (
                  <div key={i} className="flex justify-between text-[11px] text-rose-300/90" dir="ltr">
                    <span>${ob.price}</span>
                    <span className="opacity-50">{isArabic ? 'حجم:' : 'Vol:'}{Math.round(ob.volume/1000)}k</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Money Flow & Incoming Liquidity */}
          {stock.moneyFlow && (
            <div className="mb-4 bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 font-mono text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                  {isArabic ? 'مؤشر السيولة الحية المباشرة' : 'Live Net Money Flow Index'}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${stock.moneyFlow.netFlow >= 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {isArabic 
                    ? (stock.moneyFlow.netFlow >= 0 ? '🟢 تجميع سيولة' : '🔴 تصريف سيولة') 
                    : (stock.moneyFlow.netFlow >= 0 ? 'Accumulation' : 'Distribution')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-emerald-950/15 border border-emerald-500/10 rounded-lg p-1.5">
                  <div className="text-[9px] text-emerald-400/80 font-medium">{isArabic ? 'السيولة الداخلة' : 'Inflow'}</div>
                  <div className="text-emerald-400 font-bold font-mono text-[11px]">${stock.moneyFlow.inflow}M</div>
                </div>
                <div className="bg-rose-950/15 border border-rose-500/10 rounded-lg p-1.5">
                  <div className="text-[9px] text-rose-400/80 font-medium">{isArabic ? 'السيولة الخارجة' : 'Outflow'}</div>
                  <div className="text-rose-400 font-bold font-mono text-[11px]">${stock.moneyFlow.outflow}M</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/60 rounded-lg p-1.5 flex flex-col justify-center">
                  <div className="text-[9px] text-slate-400 font-medium">{isArabic ? 'صافي السيولة' : 'Net Flow'}</div>
                  <div className={`font-bold font-mono text-[11px] ${stock.moneyFlow.netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stock.moneyFlow.netFlow >= 0 ? '+' : ''}${stock.moneyFlow.netFlow}M
                  </div>
                </div>
              </div>
              {/* Liquidity Ratio Gauge */}
              <div className="space-y-1">
                <div className="flex justify-between text-[9px] text-slate-400">
                  <span>{isArabic ? 'نسبة صافي التدفق' : 'Net Flow Ratio'}</span>
                  <span className={`font-bold ${stock.moneyFlow.netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`} dir="ltr">
                    {stock.moneyFlow.netFlow >= 0 ? '+' : ''}{stock.moneyFlow.ratio}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${Math.max(15, Math.min(85, 50 + stock.moneyFlow.ratio * 1.5))}%` }} 
                  />
                  <div 
                    className="h-full bg-rose-500 flex-1 transition-all duration-500" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Active Liquidity Pools */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
              {isArabic ? 'مناطق تجمع السيولة الفعالة' : 'Target Liquidity resting pools'}
            </span>
            {smartMoney.liquidityPools.map((lp, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-mono bg-slate-950/40 border border-slate-800/50 p-2 rounded-lg" dir="ltr">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${lp.type === 'buy_side' ? 'bg-indigo-500/10 text-indigo-300' : 'bg-amber-500/10 text-amber-300'}`}>
                  {lp.type === 'buy_side' 
                    ? (isArabic ? 'سيولة شرائية' : 'Buy-side Liq') 
                    : (isArabic ? 'سيولة بيعية' : 'Sell-side Liq')}
                </span>
                <span className="text-slate-300 font-semibold">${lp.price}</span>
                <span className="text-[10px] text-slate-500 font-medium">Size: {(lp.size / 1000000).toFixed(1)}M</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sweep tape */}
        <div className="mt-4 pt-3 border-t border-slate-800/40 text-xs font-mono">
          <div className="text-[9px] text-slate-500 uppercase mb-1">
            {isArabic ? 'سجل النشاط المؤسسي المباشر' : 'Live Institutional Activity Log'}
          </div>
          {smartMoney.recentSweeps.map((s, i) => (
            <div key={i} className="flex justify-between items-center text-[10px] bg-indigo-500/5 text-indigo-300 p-1.5 rounded border border-indigo-500/10" dir="ltr">
              <span className="font-semibold">⚡ {isArabic ? `اكتساح: ${s.type === 'buy_side' ? 'سيولة شرائية' : 'سيولة بيعية'}` : `Swept: ${s.type}`}</span>
              <span>at ${s.price}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
