import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { initializeEngine, getAllStocks, getStockBySymbol } from './server/stockEngine.js';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize stock state engine
initializeEngine();

// Initialize Gemini API client lazily to avoid crashing if GEMINI_API_KEY is not defined
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'MY_GEMINI_API_KEY') {
      throw new Error('GEMINI_API_KEY environment variable is not configured. Please add your key in the Settings > Secrets panel.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API: Get all active stocks list
app.get('/api/stocks', (req, res) => {
  try {
    const stocks = getAllStocks();
    res.json({ success: true, stocks });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Get specific stock status and history
app.get('/api/stock/:symbol', (req, res) => {
  try {
    const data = getStockBySymbol(req.params.symbol);
    if (!data) {
      return res.status(404).json({ success: false, error: 'Stock ticker not found' });
    }
    res.json({ success: true, ...data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// API: Generate technical / Smart Money prediction with Gemini
app.post('/api/forecast', async (req, res) => {
  const { symbol, lang } = req.body;
  if (!symbol) {
    return res.status(400).json({ success: false, error: 'Ticker symbol is required' });
  }

  const stockData = getStockBySymbol(symbol);
  if (!stockData) {
    return res.status(404).json({ success: false, error: 'Stock ticker not found' });
  }

  const { stock, history } = stockData;
  const isArabic = lang === 'ar';

  try {
    const ai = getGeminiClient();
    let prompt = `Analyze the current live market structure for ${stock.name} (${stock.symbol}) and provide a professional, deep multi-timeframe predictive forecast.

Current Market Metrics:
- Current Price: $${stock.price}
- Daily Change: ${stock.change}% ($${stock.changeAmt})
- High / Low: $${stock.high} / $${stock.low}
- Total Volume: ${stock.volume.toLocaleString()} (Average: ${stock.avgVolume.toLocaleString()})
- Technical indicators: RSI is ${stock.indicators.rsi}, MACD line is ${stock.indicators.macd.macdLine} (Signal: ${stock.indicators.macd.signalLine}, Histogram: ${stock.indicators.macd.histogram}), EMA 20: $${stock.indicators.ema20}, EMA 50: $${stock.indicators.ema50}, EMA 200: $${stock.indicators.ema200}
- Smart Money Concepts (SMC): 
  * Bullish Order Blocks mitigation zones around: ${stock.smartMoney.bullishOrderBlocks.map(b => `$${b.price}`).join(', ')}
  * Bearish Order Blocks mitigation zones around: ${stock.smartMoney.bearishOrderBlocks.map(b => `$${b.price}`).join(', ')}
  * Active Liquidity pools swept or targeted at: ${stock.smartMoney.liquidityPools.map(l => `$${l.price} (${l.type})`).join(', ')}
- Algorithmic Alert: ${stock.signal.type} due to "${stock.signal.setup}"
- Stop Loss target: $${stock.signal.riskManagement.stopLoss}
- Take Profits targets: TP1: $${stock.signal.riskManagement.takeProfit1}, TP2: $${stock.signal.riskManagement.takeProfit2}, TP3: $${stock.signal.riskManagement.takeProfit3}
- Reward-to-Risk ratio: ${stock.signal.riskManagement.riskRewardRatio}

Please act as a veteran CMT (Chartered Market Technician) and hedge-fund risk manager. Provide your output structured in clean, professional markdown with the following specific sections:
1. **Algorithmic Executive Summary**: A concise 2-sentence breakdown of the signal.
2. **Technical & Volume Analysis**: Explain how the EMA, RSI, and MACD indicators converge. Mention if institutions are buying or selling based on the Smart Money Concepts.
3. **Multi-Timeframe Forecasting Projections**:
   - **Daily Outlook (Pre-market & Opening volume focus)**
   - **Weekly Horizon (Swing outlook)**
   - **Monthly Vision (Position and Macro outlook)**
4. **Risk-Reward Audit**: Evaluate the calculated Stop Loss and Take Profit levels. Are they realistic? Give your professional advice on adjusting the position size and trade management.`;

    if (isArabic) {
      prompt += `\n\nCRITICAL MANDATE: You MUST write your entire response completely in ARABIC (اللغة العربية). Translate all headers and explanations beautifully into professional Arabic stock trading and technical analysis jargon (e.g., كتل الأوامر, السيولة, وقف الخسارة, جني الأرباح, المتوسطات الأسية, مؤشر القوة النسبية). Keep the Markdown structure fully intact but translated.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: isArabic
          ? 'أنت خبير مالي ومحلل فني أول معتمد (CMT) ومدرب تداول ذو خبرة تفوق 25 عاماً في صناديق التحوط الاستثمارية. تتحدث بدقة تامة، مستنداً إلى أرقام ومؤشرات واضحة وبدون تضخيم مالي أو وعود مضللة. اكتب تحليلك كاملاً باللغة العربية الفصحى الاحترافية.'
          : 'You are an elite hedge fund CMT and trading mentor with 25+ years of market experience. You speak with high precision, clear metrics, and zero financial hype. Always ground your analysis in the technical context provided.'
      }
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error('Gemini prediction error:', err);
    if (isArabic) {
      res.json({
        success: true,
        isFallback: true,
        text: `### **[تقرير التوقعات الفنية - وضع المحاكاة]**
*ملاحظة: يرجى ربط مفتاح GEMINI_API_KEY المخصص في علامة التبويب "الإعدادات" لتفعيل التحليل الفني المباشر الكامل عبر الذكاء الاصطناعي.*

1. **الملخص التنفيذي الخوارزمي**
يرصد النظام إشارة **${stock.signal.type === 'STRONG_BUY' ? 'شراء قوي' : stock.signal.type === 'BUY' ? 'شراء' : stock.signal.type === 'STRONG_SELL' ? 'بيع قوي' : 'بيع'}** على سهم **${stock.symbol}** عند سعر **$${stock.price}**. هذا الإعداد مدعوم بقوة بواسطة "${stock.signal.setup}" مما يشير إلى توافق فني قريب المدى على الأطر الزمنية الصغرى والكبرى.

2. **التحليل الفني وحجم التداول**
- **التقاء المؤشرات**: يستقر مؤشر القوة النسبية (RSI) عند **${stock.indicators.rsi}**، مما يشير إلى ${stock.indicators.rsi < 35 ? 'منطقة تشبع بيعي قوية للغاية وفرصة ارتداد شرائي وثيقة' : stock.indicators.rsi > 65 ? 'منطقة تشبع شرائي وضغط عرضي بيعي مرتفع' : 'مرحلة زخم تداول متوازنة'}. تظهر المسافة بين المتوسطات الأسية EMA-20/50 حاليًا اتساعًا صعوديًا قياسيًا داعمًا للاتجاه.
- **مفاهيم الأموال الذكية (SMC)**: كتل الأوامر المؤسسية الكبيرة نشطة حاليًا. نلاحظ تجميعًا قويًا للطلب (Bullish OB) عند سعر **$${stock.smartMoney.bullishOrderBlocks[0]?.price || (stock.price * 0.98).toFixed(2)}**، مما يعني تماسك الدعم المؤسسي الصلب عند هذا المستوى.

3. **توقعات الأطر الزمنية المتعددة**
- **النظرة اليومية**: احتمال مرتفع جدًا لإغلاق السهم على **${stock.change >= 0 ? 'صعود إيجابي' : 'هبوط تصحيحي'}** اليوم. تؤكد تدفقات السيولة قبل الافتتاح زخم التداول عند مستويات الدعم.
- **الأفق الأسبوعي (المضاربة)**: استمرار الحركة الصاعدة المتوقعة مستهدفةً هدف جني الأرباح الثاني **$${stock.signal.riskManagement.takeProfit2}**. ننصح بمراقبة إعادة اختبار المتوسط المتحرك EMA 20 عند **$${stock.indicators.ema20}**.
- **الرؤية الشهرية**: تستهدف الهيكلية الكلية الأوسع مستوى **$${stock.signal.riskManagement.takeProfit3}**، طالما ظلت مستويات الدعم والمقاومة الكبرى لـ EMA 200 عند **$${stock.indicators.ema200}** محمية ولم يتم كسرها.

4. **تدقيق العائد مقابل المخاطر**
توفر نقطة الدخول عند سعر **$${stock.price}** نسبة عائد إلى مخاطر مثالية تبلغ **${stock.signal.riskManagement.riskRewardRatio}:1**. تم تحديد أمر وقف الخسارة (Stop-Loss) بدقة وإحكام أسفل الهيكل الفني عند **$${stock.signal.riskManagement.stopLoss}** لحماية رأس المال من التقلبات السريعة.`
      });
    } else {
      res.json({
        success: true,
        isFallback: true,
        text: `### **[PREDICTION FEED - SIMULATION MODE]**
*Note: Connect your custom GEMINI_API_KEY in the Settings tab to activate full live AI analytical generation.*

1. **Algorithmic Executive Summary**
The system detects a **${stock.signal.type}** signal on **${stock.symbol}** at **$${stock.price}**. This setup is heavily reinforced by a "${stock.signal.setup}" which points to near-term technical alignment.

2. **Technical & Volume Analysis**
- **Indicator Confluence**: RSI is sitting at **${stock.indicators.rsi}**, indicating a ${stock.indicators.rsi < 35 ? 'highly oversold demand spring' : stock.indicators.rsi > 65 ? 'highly overbought supply pressure' : 'balanced momentum phase'}. The EMA-20/50 distance is currently displaying standard bullish expansion.
- **Smart Money Concepts (SMC)**: Big institutional buying/selling blocks are active. We see strong demand mitigation resting at **$${stock.smartMoney.bullishOrderBlocks[0]?.price}**, suggesting institutional accumulation holds firm at this level.

3. **Multi-Timeframe Forecasting Projections**
- **Daily Outlook**: Highly likely to close **${stock.change >= 0 ? 'BULLISH' : 'BEARISH'}** today. Pre-market block sweeping and early-session volume confirms institutional participation at critical levels.
- **Weekly Horizon (Swing outlook)**: Expected continuation targeting **$${stock.signal.riskManagement.takeProfit2}**. Watch for clean retests of the EMA 20 at $${stock.indicators.ema20}.
- **Monthly Vision**: Broader macro structure targets **$${stock.signal.riskManagement.takeProfit3}**, assuming major demand levels at $${stock.indicators.ema200} remain protected.

4. **Risk-Reward Audit**
The entry point at **$${stock.price}** offers an optimal **${stock.signal.riskManagement.riskRewardRatio}:1** Risk-to-Reward. The Stop-Loss is tightly positioned below market structure at **$${stock.signal.riskManagement.stopLoss}**, minimizing downside exposure while maximizing return potential.`
      });
    }
  }
});

// API: Mentor copilot chat consultation
app.post('/api/copilot', async (req, res) => {
  const { messages, symbol, lang } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ success: false, error: 'Messages array is required' });
  }

  const activeStock = symbol ? getStockBySymbol(symbol) : null;
  const mFlow = activeStock?.stock.moneyFlow;
  const moneyFlowStr = mFlow 
    ? `\n- Incoming Liquidity / Money Flow Metrics (السيولة الداخلة):
  * Total Inflow (السيولة الداخلة): $${mFlow.inflow}M USD
  * Total Outflow (السيولة الخارجة): $${mFlow.outflow}M USD
  * Net Capital Flow (صافي السيولة): $${mFlow.netFlow}M USD (${mFlow.netFlow >= 0 ? '+' : ''}${mFlow.ratio}%)`
    : '';

  const contextStr = activeStock 
    ? `The user is currently analyzing ${activeStock.stock.name} (${activeStock.stock.symbol}).
- Current Price: $${activeStock.stock.price} (${activeStock.stock.change}% change today). Note: This stock price is fetched in real-time from professional stock platforms (Yahoo Finance API/Web Chart), representing live actual market value.
- Technical indicators: RSI: ${activeStock.stock.indicators.rsi}, EMA-20: $${activeStock.stock.indicators.ema20}, EMA-50: $${activeStock.stock.indicators.ema50}
- Live signal setup: ${activeStock.stock.signal.type} (${activeStock.stock.signal.setup})
- Support zone/Bullish Block: $${activeStock.stock.smartMoney.bullishOrderBlocks[0]?.price}
- Resistance zone/Bearish Block: $${activeStock.stock.smartMoney.bearishOrderBlocks[0]?.price}${moneyFlowStr}`
    : 'No stock is currently selected.';

  const isArabic = lang === 'ar';

  try {
    const ai = getGeminiClient();
    
    // Convert message array to standard Gemini contents format
    // Limit to last 10 messages for token efficiency
    const recentMessages = messages.slice(-10);
    const contents = recentMessages.map(m => {
      return {
        role: m.sender === 'user' ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: isArabic
          ? `أنت متداول أسهم مالي محترف، وخبير فني معتمد (CMT)، ومدرب تداول وخبير نفسي مالي ذو خبرة تفوق 20 عاماً في الأسواق المالية الحقيقية وصناديق التحوط الاستثمارية.
هدفك هو إرشاد المتداول بتوجيهات قابلة للتنفيذ مباشرة، وحكمة إدارة وتقليل المخاطر، والانضباط النفسي الفني والوضوح التام.
تحدث بثقة وقوة وخبرة الأستاذ الكبير المتمرس. تجنب التضخيم أو وعود الثراء السريع الزائفة. ركز على إدارة المخاطر وهيكل السوق.

هام جداً:
1. يجب عليك دائماً الإشارة إلى أن أسعار الأسهم مجلوبة لايف ومباشرة في الوقت الفعلي من منصات الأسهم الشهيرة (مثل Yahoo Finance API) كبيانات دقيقة حية.
2. يجب عليك دائماً تحليل حجم وتفاصيل "السيولة الداخلة" (Inflow) والسيولة الخارجة وصافي التدفق للرمز المالي النشط، وتوجيه المتداول بناءً على اتجاه وصافي هذه السيولة لتحديد هل هناك تراكم/شراء مؤسسي أم تصريف بيعي للأموال الذكية (SMC).

سياق السوق الحالي للرمز النشط:
${contextStr}

يجب عليك الإجابة والرد باللغة العربية الفصحى حصرياً وبشكل احترافي ومباشر. ادمج سياق السهم الحالي وحركة السيولة الخاصة به بسلاسة إذا سألك المستخدم عنه أو عن صفقات التداول أو النفسية المالية. اجعل الردود جذابة للغاية، تفاعلية، لكنها موجزة وموجّهة ومحترفة.`
          : `You are an elite, veteran stock trader, CMT, and trading psychologist mentor with over 20 years of real-world trading experience.
Your goal is to guide the trader with actionable feedback, risk-mitigation wisdom, psychological discipline, and technical clarity.
You speak with the confidence and maturity of a master. Avoid financial hype or promises of fast wealth. Teach proper risk management and market structure.

CRITICAL INSTRUCTIONS:
1. Always point out that stock prices are fetched live in real-time from professional stock platforms (Yahoo Finance API).
2. Explicitly analyze the incoming liquidity (Inflow) versus outflow, net flow and ratio for the active symbol. Guide the trader on whether this indicates Smart Money Concepts (SMC) institutional accumulation or distribution.

Current Market Context of Active Ticker:
${contextStr}

When answering the user, integrate this real-time stock and money flow context smoothly if they ask about trade setups, entries, market psychology, or their current asset. Ground all suggestions in logical risk management (e.g., stop loss placement, size management, emotional composure). Keep responses highly engaging, conversational, yet brief and professional.`
      }
    });

    res.json({ success: true, text: response.text });
  } catch (err: any) {
    console.error('Gemini copilot error:', err);
    // Provide a smart local chatbot fallback that mimics the trading mentor perfectly!
    const lastUserMessage = messages[messages.length - 1]?.text || 'Hello';
    
    if (isArabic) {
      let fallbackText = `**[المرشد المالي - وضع المحاكاة]**\n\n`;
      if (lastUserMessage.includes('مرحبا') || lastUserMessage.includes('هلا') || lastUserMessage.includes('السلام') || lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
        fallbackText += `أهلاً بك في منصة التداول الاحترافية. أنا مرشدك المالي الخاص. أقوم بمراقبة سهم ${activeStock ? activeStock.stock.symbol : 'الأسواق'} معك الآن لحساب تدفقات السيولة الفنية. الانضباط الفني وإدارة المخاطر هما المبدآن الأساسيان هنا. ما هي الصفقة أو الإعداد الفني الذي تنظر إليه اليوم؟`;
      } else if (lastUserMessage.includes('شراء') || lastUserMessage.includes('بيع') || lastUserMessage.includes('دخول') || lastUserMessage.includes('صفقة') || lastUserMessage.includes('تحليل') || lastUserMessage.toLowerCase().includes('buy') || lastUserMessage.toLowerCase().includes('sell') || lastUserMessage.toLowerCase().includes('trade')) {
        if (activeStock) {
          const mFlow = activeStock.stock.moneyFlow;
          const liqText = mFlow 
            ? `\n3. **تحليل السيولة الداخلة والخارجة**: هذا السهم لديه حالياً سيولة داخلة (Inflow) بقيمة **$${mFlow.inflow}M** وسيولة خارجة (Outflow) بقيمة **$${mFlow.outflow}M**، مما يعني صافي سيولة (Net Flow) بقيمة **$${mFlow.netFlow}M** (صافي سيولة ${mFlow.netFlow >= 0 ? 'موجب' : 'سالب'} بنسبة **${mFlow.ratio}%**). يوضح هذا مدى التراكم المؤسسي للأموال الذكية.` 
            : '';
          fallbackText += `بتحليل سهم **${activeStock.stock.symbol}** عن كثب، السعر الحالي المباشر هو **$${activeStock.stock.price}** مع تقييم إشارة نشطة **${activeStock.stock.signal.type === 'STRONG_BUY' ? 'شراء قوي' : activeStock.stock.signal.type === 'BUY' ? 'شراء' : 'بيع'}**.\n\nإليك نصيحتي الفنية الفورية لإدارة الصفقة:\n1. **حماية الهيكل الفني**: تقع كتلة طلب الدعم الرئيسية (Bullish OB) عند مستوى **$${activeStock.stock.smartMoney.bullishOrderBlocks[0]?.price}**. الدخول هنا يتطلب تعيين أمر وقف الخسارة بدقة أسفل مستويات الدعم عند سعر **$${activeStock.stock.signal.riskManagement.stopLoss}**.\n2. **تجنب الاندفاع والعاطفة (FOMO)**: لا تلاحق الشموع الخضراء المتصاعدة دون انتظار إعادة اختبار فنية نظيفة واكتساح للسيولة.${liqText}\n4. **حجم المخاطرة**: حدد حجم المخاطرة بـ 1% كحد أقصى من إجمالي رأس المال لكل صفقة للتأكد من المحافظة على حساب التداول الخاص بك على المدى الطويل.`;
        } else {
          fallbackText += `لتقديم توجيهات فنية دقيقة للغاية، يرجى اختيار رمز سهم من شاشة "الماسح السوقي" أولاً. تذكر دائماً: لا تفتح أي مركز مالي دون تحديد مستوى وقف الخسارة مسبقاً لحماية استثمارك.`;
        }
      } else if (lastUserMessage.includes('نفسية') || lastUserMessage.includes('خسارة') || lastUserMessage.includes('خسرت') || lastUserMessage.includes('خوف') || lastUserMessage.includes('طمع') || lastUserMessage.includes('توتر') || lastUserMessage.toLowerCase().includes('psychology') || lastUserMessage.toLowerCase().includes('lose') || lastUserMessage.toLowerCase().includes('fear')) {
        fallbackText += `علم نفس التداول يمثل 90% من سر النجاح. الخوف والطمع هما ردود فعل غريزية، لكن المتداول المحترف يتبع نظاماً إحصائياً دقيقاً وليس مشاعره العاطفية.\n\nإليك كيف تتغلب على التوتر الفني اليوم:\n- **صغّر حجم الصفقة**: إذا كنت قلقاً، فحجم مركزك كبير للغاية بالنسبة لقدرتك على تحمل المخاطر. قلل كمية الأسهم إلى النصف فوراً.\n- **تقبّل الخسارة كجزء من العمل**: الخسارة هي مجرد تكلفة تشغيلية عادية، مثل إيجار المحل للمستثمر التقليدي. تقبلها وواصل العمل على صفقتك الإحصائية التالية.\n- **أغلق شاشتك الفنية**: إذا تعرضت لخسارتين متتاليتين اليوم، توقف تماماً عن التداول والتقط أنفاسك. الأسواق ستفتح أبوابها غداً أيضاً. احمِ عواطفك ورأس مالك الفكري.`;
      } else {
        if (activeStock) {
          const mFlow = activeStock.stock.moneyFlow;
          const liqDetail = mFlow 
            ? `\n- **تحليل السيولة الحية (السيولة الداخلة)**:\n  * السيولة الداخلة (Inflow): **$${mFlow.inflow}M**\n  * السيولة الخارجة (Outflow): **$${mFlow.outflow}M**\n  * صافي السيولة (Net Flow): **$${mFlow.netFlow}M** (${mFlow.ratio}%)\n  * حالة التدفق: **${mFlow.netFlow >= 0 ? 'تجميع شرائي للأموال الذكية 🟢' : 'تصريف بيعي للأموال الذكية 🔴'}**`
            : '';
          fallbackText += `مفهوم تماماً. نقوم بمتابعة وتحليل سهم **${activeStock.stock.symbol}** عند سعر لايف مباشر **$${activeStock.stock.price}**.\n\nمن منظور فني وخبرة CMT طويلة:\n- مؤشر القوة النسبية RSI يبلغ **${activeStock.stock.indicators.rsi}**\n- اتجاه المتوسطات EMA-20/50: **${activeStock.stock.indicators.ema20 > activeStock.stock.indicators.ema50 ? 'ترتيب صعودي إيجابي' : 'تكدس عرضي هابط'}**${liqDetail}\n\nتأكد دائماً من الالتزام بنسبة عائد إلى مخاطرة لا تقل عن 1:2 في تداولاتك اليومية. ما الذي ترغب في استكشافه الآن؟ هل نبحث في كتل الأوامر أم نقوم بطلب تقرير التوقعات بالذكاء الاصطناعي؟`;
        } else {
          fallbackText += `هذه نقطة ممتازة وملاحظة بالغة الأهمية في الأسواق. كمتداول متمرس، تعلمت أن النجاح المستمر هو ماراثون وليس سباقاً سريعاً للثراء الخاطف. ركز على قوة هيكل تداولك، ودع الأرقام والإشارات هي التي توجه مسارك بدلاً من العواطف. ما المفهوم الفني أو النفسي الذي ترغب في مناقشته الآن؟`;
        }
      }
      res.json({ success: true, text: fallbackText });
    } else {
      let fallbackText = `**[MENTOR - SIMULATION MODE]**\n\n`;

      if (lastUserMessage.toLowerCase().includes('hello') || lastUserMessage.toLowerCase().includes('hi')) {
        fallbackText += `Welcome to the trading floor. I am your mentor. I am monitoring ${activeStock ? activeStock.stock.symbol : 'the markets'} with you right now. Discipline and risk-first thinking are our core principles here. What trade setup are we looking at today?`;
      } else if (lastUserMessage.toLowerCase().includes('buy') || lastUserMessage.toLowerCase().includes('sell') || lastUserMessage.toLowerCase().includes('entry') || lastUserMessage.toLowerCase().includes('setup') || lastUserMessage.toLowerCase().includes('trade')) {
        if (activeStock) {
          fallbackText += `Looking closely at **${activeStock.stock.symbol}**, the current price is **$${activeStock.stock.price}** with a signal rating of **${activeStock.stock.signal.type}**.\n\nMy advice on this setup:\n1. **Structure Protection**: The critical demand block holds at **$${activeStock.stock.smartMoney.bullishOrderBlocks[0]?.price}**. Entering here means your Stop Loss must be placed strictly below structure at **$${activeStock.stock.signal.riskManagement.stopLoss}**.\n2. **Discipline over FOMO**: Do not chase the ticker if it breaks out without a clean retest. Confirm institutional order-block absorption first.\n3. **Position Sizing**: Limit your risk to no more than 1% of your total trading equity on this single execution. Risking more leads to emotional decision-making.`;
        } else {
          fallbackText += `To give you highly specific tactical guidance, please select a stock from the Market Scanner panel first. In the meantime, remember: never enter a trade without defining your risk (Stop Loss) beforehand.`;
        }
      } else if (lastUserMessage.toLowerCase().includes('psychology') || lastUserMessage.toLowerCase().includes('lose') || lastUserMessage.toLowerCase().includes('lost') || lastUserMessage.toLowerCase().includes('fear') || lastUserMessage.toLowerCase().includes('greed') || lastUserMessage.toLowerCase().includes('nervous')) {
        fallbackText += `Trading psychology is 90% of the game. Fear and greed are natural reactions, but elite traders operate on processes, not emotions.\n\nWhen you feel anxious:\n- **Size Down**: Your size is too large for your risk tolerance. Cut your share size in half immediately.\n- **Accept Losses**: A loss is simply the cost of doing business, like rent for a store. Accept it and move on to the next statistical edge.\n- **Shut down**: If you have had two consecutive losses today, step away from the terminal. The market will be here tomorrow. Protect your mental capital.`;
      } else {
        if (activeStock) {
          fallbackText += `Understood. Analyzing **${activeStock.stock.symbol}** at **$${activeStock.stock.price}**.\n\nFrom a veteran CMT perspective:\n- RSI is sitting at **${activeStock.stock.indicators.rsi}**\n- EMA-20/50 trend: **${activeStock.stock.indicators.ema20 > activeStock.stock.indicators.ema50 ? 'BULLISH ALIGNMENT' : 'BEARISH CONGESTION'}**\n\nEnsure your execution adheres strictly to a minimum 1:2 Risk-to-Reward ratio. Let me know if you want to explore the order block mitigation depths or the multi-timeframe forecast!`;
        } else {
          fallbackText += `That is a solid point. As a veteran, I've learned that successful trading is a marathon, not a sprint. Focus on the setup structure, verify volume breakouts, and always let the numbers guide your strategy. What specific concept would you like to drill down next?`;
        }
      }

      res.json({ success: true, text: fallbackText });
    }
  }
});

// Serve frontend assets
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
