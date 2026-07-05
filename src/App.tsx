import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StockData, Candlestick, ChatMessage } from './types';
import PriceChart from './components/PriceChart';
import MarketDetails from './components/MarketDetails';
import CopilotChat from './components/CopilotChat';
import MarkdownView from './components/MarkdownView';
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  Clock, 
  Bot, 
  Sparkles, 
  FileText, 
  RefreshCw, 
  Layers, 
  BookOpen, 
  Maximize2,
  Smartphone,
  Laptop,
  Wifi,
  Battery,
  Signal,
  Compass,
  ArrowRight,
  Shield,
  Gauge,
  MessageSquare,
  Folder,
  FolderOpen
} from 'lucide-react';

const WATCHLISTS = [
  { id: 'ALL', labelEn: 'All Lists', labelAr: 'كل القوائم' },
  { id: 'future', labelEn: 'future', labelAr: 'مستقبلية' },
  { id: 'saveor for investmen', labelEn: 'saveor for investmen', labelAr: 'ادخار للاستثمار' },
  { id: 'E commerce', labelEn: 'E commerce', labelAr: 'تجارة إلكترونية' },
  { id: 'Elon mask', labelEn: 'Elon mask', labelAr: 'إيلون ماسك' },
  { id: 'Technology & Hardwar', labelEn: 'Technology & Hardwar', labelAr: 'تكنولوجيا وأجهزة' },
  { id: 'Health', labelEn: 'Health', labelAr: 'صحة' },
  { id: 'Semiconductors', labelEn: 'Semiconductors', labelAr: 'أشباه الموصلات' },
];
import { motion, AnimatePresence } from 'motion/react';

const translations = {
  en: {
    appTitle: "HOMOD'S TRADE",
    appSubtitle: "US Stock Trading & AI Predictive Analytics",
    workspacePreview: "WORKSPACE PREVIEW:",
    desktopWorkstation: "Desktop Workstation",
    androidApk: "Android APK Simulated",
    language: "LANGUAGE / اللغة:",
    marketScanner: "Market Scanner",
    all: "ALL",
    nyse: "NYSE",
    nasdaq: "NASDAQ",
    amex: "AMEX",
    forex: "FOREX",
    searchPlaceholder: "Search US Stock symbols...",
    suggestedAction: "Suggested Action",
    entryTarget: "Entry Target",
    stopLoss: "Stop Loss",
    indicatorsConfluence: "Indicators Confluence",
    bullishOb: "Bullish OB",
    bearishOb: "Bearish OB",
    aiQuantitativeForecast: "AI Quantitative Forecast",
    realtimeCmt: "Real-time CMT Structural Analysis",
    generateReport: "Generate Report",
    geminiScanning: "Gemini is scanning market order flows...",
    reportDescription: "Generate a professional hedge-fund grade technical report containing multi-timeframe forecasts for **{symbol}**.",
    scanner: "Scanner",
    tradeChart: "Trade Chart",
    aiPredict: "AI Predict",
    mentor: "Mentor",
    bootingEngine: "BOOTING HOMOD'S TRADE ENGINE",
    configuringResources: "Configuring native Android resources & market streams...",
    liveSession: "LIVE TRADING SESSION",
    changeTicker: "CHG TICKER →",
    activeScanner: "Active Market Scanner",
    indicatorConvergence: "NYSE / NASDAQ Listed • Real-Time Indicator Convergence",
    runAiPrediction: "Run AI Prediction",
    analyzingStructure: "Analyzing Structure...",
    reportTitle: "AI Quantitative Forecast Report",
    reportModel: "Model: gemini-3.5-flash | Dynamic Structural Grounding",
    compilingTape: "Gemini is compiling market tape and order book depth profiles...",
    activeQuote: "Active Stock Quote",
    liveFeedSync: "Live 5m feed sync • CMT Rating",
    runForecastShortcut: "Run AI Multi-Timeframe Forecast",
    systemActive: "PROACTIVE ALGORITHMIC ENGINE STABLE • SYSTEM ACTIVE",
    secureCloud: "SECURE CLOUD ENGINE COUPLING",
    noMatchingTickers: "No matching tickers found."
  },
  ar: {
    appTitle: "HOMOD'S TRADE",
    appSubtitle: "الماسح السريع لأسواق المال وتوليد تحليلات الذكاء الاصطناعي",
    workspacePreview: "معاينة بيئة العمل:",
    desktopWorkstation: "شاشة التداول الكاملة",
    androidApk: "تطبيق أندرويد محاكي (APK)",
    language: "اللغة / LANGUAGE:",
    marketScanner: "ماسح السوق المباشر",
    all: "الكل",
    nyse: "NYSE",
    nasdaq: "NASDAQ",
    amex: "AMEX",
    forex: "فوركس",
    searchPlaceholder: "البحث عن رمز السهم...",
    suggestedAction: "الصفقة الفنية المقترحة",
    entryTarget: "نقطة الدخول",
    stopLoss: "وقف الخسارة",
    indicatorsConfluence: "التقاء المؤشرات الفنية",
    bullishOb: "كتلة شراء صعودية",
    bearishOb: "كتلة بيع هبوطية",
    aiQuantitativeForecast: "التوقع الكمي بالذكاء الاصطناعي",
    realtimeCmt: "تحليل هيكلي فني فوري (CMT)",
    generateReport: "توليد التقرير التنبئي",
    geminiScanning: "نموذج جيمي يفحص تدفقات السيولة وصانع السوق...",
    reportDescription: "توليد تقرير فني واحترافي بمستوى صناديق التحوط يغطي سيناريوهات التداول وتوقعات السعر متعددة الفترات لـ **{symbol}**.",
    scanner: "الماسح",
    tradeChart: "الرسم البياني",
    aiPredict: "التوقعات",
    mentor: "المرشد المالي",
    bootingEngine: "جاري تشغيل محرك HOMOD'S TRADE...",
    configuringResources: "جاري تهيئة قنوات الاتصال والتدفقات الحية المباشرة لأسواق المال...",
    liveSession: "جلسة تداول مباشرة نشطة",
    changeTicker: "تغيير السهم ←",
    activeScanner: "ماسح السوق المباشر النشط",
    indicatorConvergence: "مدرج في السوق الأمريكي • التقاء المؤشرات الفنية الفورية",
    runAiPrediction: "توليد توقعات الذكاء الاصطناعي",
    analyzingStructure: "جاري تحليل الهيكل الفني...",
    reportTitle: "تقرير التوقع المالي بالذكاء الاصطناعي",
    reportModel: "النموذج: gemini-3.5-flash | معالجة فورية للسيولة ومستويات صانع السوق",
    compilingTape: "جاري فحص تفاصيل شريط التداول وعمق سجل الأوامر المؤسسية...",
    activeQuote: "بيانات السعر الفورية",
    liveFeedSync: "تحديث فوري كل 5 دقائق • تقييم معتمد",
    runForecastShortcut: "تشغيل التوقع متعدد الفترات بالذكاء الاصطناعي",
    systemActive: "محرك الخوارزميات النشط يعمل بكفاءة • النظام مستقر",
    secureCloud: "اتصال آمن ومحمي بالسحابة الذكية",
    noMatchingTickers: "لم يتم العثور على رموز مطابقة."
  }
};

export default function App() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [activeHistory, setActiveHistory] = useState<Candlestick[]>([]);
  
  // View Toggle States
  const [isAndroidMode, setIsAndroidMode] = useState(true); // Defaults to mobile showcasing
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'scanner' | 'chart' | 'forecast' | 'mentor'>('scanner');

  // Multi-Language Support State
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'ar'>('ar'); // Defaulting to Arabic Version!
  const isArabic = currentLanguage === 'ar';

  const t = (key: keyof typeof translations['en'], replace?: Record<string, string>): string => {
    let str = translations[currentLanguage][key] || translations['en'][key] || String(key);
    if (replace) {
      Object.entries(replace).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v);
      });
    }
    return str;
  };

  // UI Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'NYSE' | 'NASDAQ' | 'AMEX' | 'FOREX'>('ALL');
  const [activeWatchlist, setActiveWatchlist] = useState<string>('ALL');
  
  // Forecasting & Copilot states
  const [isForecastPending, setIsForecastPending] = useState(false);
  const [aiForecast, setAiForecast] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatPending, setIsChatPending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasFetchError, setHasFetchError] = useState(false);

  // Keep track of old price to animate price updates
  const prevPriceRef = useRef<Record<string, number>>({});
  const [priceFlash, setPriceFlash] = useState<Record<string, 'up' | 'down' | null>>({});

  // Market status indicator (US Core Trading Session simulated hours)
  const [marketStatus, setMarketStatus] = useState('LIVE TRADING SESSION');
  const [currentTime, setCurrentTime] = useState('');

  // Detect physical mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobileDevice(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch all stocks list on load and periodically
  const fetchStocksList = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await fetch('/api/stocks');
      const data = await res.json();
      if (data.success) {
        setHasFetchError(false);
        // Animate price updates with visual flashes
        const newFlash: Record<string, 'up' | 'down' | null> = {};
        data.stocks.forEach((s: StockData) => {
          const oldPrice = prevPriceRef.current[s.symbol];
          if (oldPrice !== undefined && oldPrice !== s.price) {
            newFlash[s.symbol] = s.price > oldPrice ? 'up' : 'down';
          }
          prevPriceRef.current[s.symbol] = s.price;
        });

        if (Object.keys(newFlash).length > 0) {
          setPriceFlash(newFlash);
          setTimeout(() => setPriceFlash({}), 1000);
        }

        setStocks(data.stocks);

        // Update active stock reference dynamically to keep metrics fresh
        if (selectedStock) {
          const freshActive = data.stocks.find((st: StockData) => st.symbol === selectedStock.symbol);
          if (freshActive) {
            setSelectedStock(freshActive);
          }
        } else if (data.stocks.length > 0) {
          const preferredStock = data.stocks.find((st: StockData) => st.symbol === 'MU') || 
                                 data.stocks.find((st: StockData) => st.symbol === 'AVGO') || 
                                 data.stocks.find((st: StockData) => st.symbol === 'NVDA') || 
                                 data.stocks[0];
          setSelectedStock(preferredStock);
        }
      } else {
        setHasFetchError(true);
      }
    } catch (err) {
      console.error('Error fetching stocks list:', err);
      setHasFetchError(true);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Fetch active stock candle history when selection changes
  const fetchActiveHistory = async (symbol: string) => {
    try {
      const res = await fetch(`/api/stock/${symbol}`);
      const data = await res.json();
      if (data.success) {
        setActiveHistory(data.history);
        setHasFetchError(false);
      } else {
        setHasFetchError(true);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
      setHasFetchError(true);
    }
  };

  // Initial load
  useEffect(() => {
    fetchStocksList(true);
  }, []);

  // Fetch historical data on selected stock change
  useEffect(() => {
    if (selectedStock) {
      fetchActiveHistory(selectedStock.symbol);
      setAiForecast(null);
    }
  }, [selectedStock?.symbol]);

  // Dynamic state polling (every 3 seconds) for live feeds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStocksList(false);
      if (selectedStock) {
        fetchActiveHistory(selectedStock.symbol);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedStock?.symbol]);

  // Generate AI Multi-Timeframe Forecast Report
  const handleGenerateForecast = async () => {
    if (!selectedStock) return;
    setIsForecastPending(true);
    setAiForecast(null);
    try {
      const res = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: selectedStock.symbol, lang: currentLanguage })
      });
      const data = await res.json();
      if (data.success) {
        setAiForecast(data.text);
      }
    } catch (err) {
      console.error('Error generating forecast:', err);
    } finally {
      setIsForecastPending(false);
    }
  };

  // Send message to the Copilot Trading Mentor
  const handleSendCopilotMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setIsChatPending(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          symbol: selectedStock?.symbol,
          lang: currentLanguage
        })
      });
      const data = await res.json();
      if (data.success) {
        const assistantMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChatMessages(prev => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Error contacting mentor copilot:', err);
    } finally {
      setIsChatPending(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([]);
  };

  // Filter and Search logic
  const filteredStocks = useMemo(() => {
    return stocks.filter(s => {
      const matchesSearch = s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            s.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesMarket = true;
      if (marketFilter !== 'ALL') {
        matchesMarket = s.exchange === marketFilter;
      }

      let matchesWatchlist = true;
      if (activeWatchlist !== 'ALL') {
        matchesWatchlist = s.watchlist === activeWatchlist;
      }

      return matchesSearch && matchesMarket && matchesWatchlist;
    });
  }, [stocks, searchTerm, marketFilter, activeWatchlist]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100 font-sans gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <Cpu className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 animate-pulse" size={18} />
        </div>
        <div className="text-center px-4">
          <h3 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">{t('bootingEngine')}</h3>
          <p className="text-xs text-slate-500 mt-1">{t('configuringResources')}</p>
        </div>
      </div>
    );
  }

  // Determine if we should show the Android phone container layout (forced on mobile screens)
  const renderAsMobile = isAndroidMode || isMobileDevice;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased ${renderAsMobile && isMobileDevice ? 'h-screen h-[100dvh] overflow-hidden' : ''}`}>
      
      {/* Dynamic Viewport Mode Switcher (Hidden on actual physical mobile devices) */}
      {!isMobileDevice && (
        <div className="bg-slate-900 border-b border-slate-800/80 px-4 py-2 flex justify-between items-center z-50 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{t('workspacePreview')}</span>
            <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800/60 flex">
              <button
                onClick={() => setIsAndroidMode(false)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  !isAndroidMode 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id="preview-desktop-btn"
              >
                <Laptop size={12} />
                {t('desktopWorkstation')}
              </button>
              <button
                onClick={() => setIsAndroidMode(true)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  isAndroidMode 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                id="preview-android-btn"
              >
                <Smartphone size={12} />
                {t('androidApk')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                {t('language')}
              </span>
              <div className="bg-slate-950 p-0.5 rounded-lg border border-slate-800/60 flex">
                <button
                  onClick={() => setCurrentLanguage('en')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    currentLanguage === 'en'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="lang-en-btn"
                >
                  English
                </button>
                <button
                  onClick={() => setCurrentLanguage('ar')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                    currentLanguage === 'ar'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  id="lang-ar-btn"
                >
                  العربية
                </button>
              </div>
            </div>

            <div className="text-[10px] text-indigo-400 font-mono font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              {isArabic ? 'النسخة التجريبية APK نشطة' : 'ANDROID BUILD v1.0.4-PRO ACTIVE'}
            </div>
          </div>
        </div>
      )}

      {/* Render the Android View */}
      {renderAsMobile ? (
        <div className={`flex-1 flex items-center justify-center ${isMobileDevice ? 'p-0 bg-slate-950 w-full h-full' : 'py-8 px-4 bg-radial from-slate-900 via-slate-950 to-black'}`}>
          
          {/* Android Outer Device Frame - Only rendered on desktop viewports */}
          <div className={`${
            isMobileDevice 
              ? 'w-full h-full relative overflow-hidden flex flex-col bg-slate-950' 
              : 'w-full max-w-[400px] h-[820px] bg-slate-950 border-[12px] border-slate-800 rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col'
          }`} id="android-device-shell">
            
            {/* Simulated Device Top Notch & Camera */}
            {!isMobileDevice && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-900 rounded-full z-50 flex items-center justify-center">
                <div className="w-3 h-3 bg-slate-950 rounded-full border border-slate-800/80 mr-12" />
                <div className="w-1.5 h-1.5 bg-indigo-500/20 rounded-full" />
              </div>
            )}

            {/* Simulated Android Status Bar */}
            <div className={`bg-slate-950 flex justify-between items-center px-6 py-2.5 select-none ${isMobileDevice ? 'pt-4' : 'pt-3.5'} z-40`}>
              <div className="text-xs font-bold text-slate-200 font-mono tracking-tight flex items-center gap-1">
                {currentTime.substring(0, 5)}
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
              </div>
            </div>

            {/* Android Screen Header / Active stock banner */}
            <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-lg shadow-md">
                  <Activity size={14} />
                </div>
                <div>
                  <h1 className="text-xs font-black tracking-tight text-white flex items-center gap-1">
                    {t('appTitle')} <span className="text-[8px] text-indigo-400 border border-indigo-500/30 px-1 rounded-sm bg-indigo-500/5 font-mono">APK</span>
                  </h1>
                  <span className="text-[9px] text-slate-400 font-mono block leading-none mt-0.5">
                    {isArabic ? 'جلسة تداول نشطة بالسوق الأمريكي' : marketStatus}
                  </span>
                  {/* Language Switcher */}
                  <div className="flex items-center gap-1 mt-1.5 select-none" dir="ltr">
                    <button
                      onClick={() => setCurrentLanguage('en')}
                      className={`px-1 py-0.5 rounded text-[8px] font-black transition-all border ${
                        currentLanguage === 'en'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-500 border-slate-900/60 hover:text-slate-300'
                      }`}
                      id="mobile-lang-en"
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setCurrentLanguage('ar')}
                      className={`px-1 py-0.5 rounded text-[8px] font-black transition-all border ${
                        currentLanguage === 'ar'
                          ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-sm'
                          : 'bg-slate-950/60 text-slate-500 border-slate-900/60 hover:text-slate-300'
                      }`}
                      id="mobile-lang-ar"
                    >
                      عربي
                    </button>
                  </div>
                </div>
              </div>
              
              {selectedStock && (
                <div className="text-right font-mono" dir="ltr">
                  <span className="text-xs font-bold text-slate-200">${selectedStock.price.toFixed(selectedStock.price < 5 ? 4 : 2)}</span>
                  <span className={`text-[9px] block font-bold ${selectedStock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>

            {/* Main Interactive Screen View (Dynamic based on selected bottom Tab) */}
            <div className={`flex-1 flex flex-col bg-slate-950 scrollbar-none ${
              activeMobileTab === 'mentor' 
                ? 'overflow-hidden p-0 pb-[54px]' 
                : 'overflow-y-auto p-4 pb-20'
            }`}>
              {hasFetchError && (
                <div className="mb-4 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2.5 text-amber-400 text-xs" dir={isArabic ? 'rtl' : 'ltr'}>
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping shrink-0" />
                  <p>
                    {isArabic 
                      ? 'ملاحظة: جاري محاولة إعادة الاتصال بموجز البيانات المباشر...' 
                      : 'Syncing: Reconnecting to the live stock data feed...'}
                  </p>
                </div>
              )}
              
              {/* Tab 1: SCANNER */}
              {activeMobileTab === 'scanner' && (
                <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Layers size={11} className="text-indigo-400" /> {t('marketScanner')} ({filteredStocks.length})
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500">NYSE/NASDAQ/AMEX</span>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-2.5 text-slate-500`} size={13} />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 focus:border-indigo-500 focus:outline-none rounded-xl ${isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-xs text-slate-200 placeholder-slate-600 transition-colors`}
                      id="android-search-field"
                    />
                  </div>

                  {/* Watchlist Folders Horizontal Bar */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1 select-none scrollbar-none" dir={isArabic ? 'rtl' : 'ltr'}>
                    {WATCHLISTS.map((wl) => {
                      const isSelected = activeWatchlist === wl.id;
                      return (
                        <button
                          key={wl.id}
                          onClick={() => {
                            setActiveWatchlist(wl.id);
                            if (wl.id !== 'ALL') setMarketFilter('ALL');
                          }}
                          className={`flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${
                            isSelected
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 font-black'
                              : 'bg-slate-900/60 text-slate-500 border-slate-800/60'
                          }`}
                          id={`wl-folder-mobile-${wl.id}`}
                        >
                          {wl.id === 'ALL' ? (
                            <Layers size={10} className="text-indigo-400" />
                          ) : (
                            <Folder size={10} className={isSelected ? 'text-amber-400 fill-amber-400/20' : 'text-amber-500/60'} />
                          )}
                          <span>{isArabic ? wl.labelAr : wl.labelEn}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Exchange chips */}
                  <div className="grid grid-cols-5 gap-1 select-none">
                    {(['ALL', 'NYSE', 'NASDAQ', 'AMEX', 'FOREX'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMarketFilter(m)}
                        className={`text-[9px] font-bold py-1.5 rounded-lg transition-all border ${
                          marketFilter === m 
                            ? 'bg-indigo-600/10 text-indigo-300 border-indigo-500/40 font-black' 
                            : 'bg-slate-900/40 text-slate-500 border-slate-800/60'
                        }`}
                        id={`android-tab-${m}`}
                      >
                        {m === 'ALL' ? t('all') : m === 'FOREX' ? t('forex') : m}
                      </button>
                    ))}
                  </div>

                  {/* Active listings */}
                  <div className="space-y-2 pt-1">
                    {filteredStocks.map((st) => {
                      const isSelected = selectedStock?.symbol === st.symbol;
                      const flash = priceFlash[st.symbol];
                      return (
                        <button
                          key={st.symbol}
                          onClick={() => {
                            setSelectedStock(st);
                            setActiveMobileTab('chart'); // Dynamic smooth mobile UX routing
                          }}
                          className={`w-full text-left rounded-xl p-3 border transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/15 border-indigo-500/40' 
                              : 'bg-slate-900/30 border-slate-850 hover:bg-slate-900/40'
                          }`}
                          id={`android-row-${st.symbol}`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-200 font-mono">{st.symbol}</span>
                              <span className="text-[9px] text-slate-500 truncate max-w-[100px]">{st.name}</span>
                            </div>
                            <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-full font-mono ${
                              st.signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400' :
                              st.signal.type.includes('SELL') ? 'bg-rose-500/10 text-rose-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {st.signal.type.replace('STRONG_', '')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center font-mono text-xs" dir="ltr">
                            <span className={`font-extrabold ${
                              flash === 'up' ? 'text-emerald-400 scale-105' :
                              flash === 'down' ? 'text-rose-400 scale-105' :
                              'text-slate-300'
                            }`}>
                              ${st.price.toFixed(st.price < 5 ? 4 : 2)}
                            </span>
                            <span className={`font-bold text-[10px] ${st.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {st.change >= 0 ? '+' : ''}{st.change.toFixed(2)}%
                            </span>
                          </div>

                          {st.moneyFlow && (
                            <div className="flex justify-between items-center text-[9px] mt-1.5 pt-1.5 border-t border-slate-800/30 text-slate-500 font-mono" dir="ltr">
                              <span className="text-slate-500">{isArabic ? 'السيولة النشطة:' : 'Live Liquidity:'}</span>
                              <span className={`font-bold ${st.moneyFlow.netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.moneyFlow.netFlow >= 0 ? '▲ +' : '▼ '}${st.moneyFlow.netFlow}M ({st.moneyFlow.ratio}%)
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: ACTIVE TRADING CHART & PARAMETERS */}
              {activeMobileTab === 'chart' && selectedStock && (
                <div className="space-y-4">
                  
                  {/* Selected Stock Quote Info */}
                  <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3 flex justify-between items-center" dir={isArabic ? 'rtl' : 'ltr'}>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-indigo-400 font-mono bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20">{selectedStock.symbol}</span>
                        <h4 className="text-xs font-bold text-slate-200 truncate max-w-[110px]">{selectedStock.name}</h4>
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 block">{t('liveFeedSync')}</span>
                    </div>

                    <button
                      onClick={() => setActiveMobileTab('scanner')}
                      className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 font-mono"
                      id="android-back-scanner-btn"
                    >
                      {t('changeTicker')}
                    </button>
                  </div>

                  {/* Price Chart */}
                  {activeHistory.length > 0 ? (
                    <div className="border border-slate-850 rounded-xl overflow-hidden shadow-lg bg-slate-900/10">
                      <PriceChart 
                        symbol={selectedStock.symbol} 
                        history={activeHistory} 
                        stock={selectedStock} 
                      />
                    </div>
                  ) : (
                    <div className="h-44 bg-slate-900/40 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-[10px]">
                      {isArabic ? 'جاري تحميل الشموع الفورية لبيانات السوق...' : 'Loading real-time candles...'}
                    </div>
                  )}

                  {/* Rapid AI Forecast action bar */}
                  <button
                    onClick={() => {
                      handleGenerateForecast();
                      setActiveMobileTab('forecast'); // Dynamic routing to forecast tab
                    }}
                    className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-indigo-600/10"
                    id="android-forecast-shortcut-btn"
                  >
                    <Sparkles size={12} />
                    {t('runForecastShortcut')}
                  </button>

                  {/* Market parameters (Mini layout) */}
                  <div className="space-y-4 pt-1" dir={isArabic ? 'rtl' : 'ltr'}>
                    {/* Strategy setup block */}
                    <div className="bg-slate-900/60 border border-slate-800/85 rounded-xl p-3.5 space-y-2.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <Shield size={11} className="text-indigo-400" /> {t('suggestedAction')}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full font-mono ${
                          selectedStock.signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                        }`}>
                          {selectedStock.signal.type}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 italic">"{selectedStock.signal.setup}"</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                        <div className="bg-slate-950/40 p-2 rounded border border-slate-850/60">
                          <span className="text-slate-500 block text-[8px] uppercase">{t('entryTarget')}</span>
                          <span className="text-slate-200 font-bold">${selectedStock.signal.riskManagement.entry.toFixed(2)}</span>
                        </div>
                        <div className="bg-slate-950/40 p-2 rounded border border-slate-850/60">
                          <span className="text-rose-500 block text-[8px] uppercase">{t('stopLoss')}</span>
                          <span className="text-rose-400 font-bold">${selectedStock.signal.riskManagement.stopLoss.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Indicator panel */}
                    <div className="bg-slate-900/60 border border-slate-800/85 rounded-xl p-3.5 space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Gauge size={11} className="text-indigo-400" /> {t('indicatorsConfluence')}
                      </span>

                      <div>
                        <div className="flex justify-between text-[10px] font-mono mb-1">
                          <span className="text-slate-500">RSI (14)</span>
                          <span className="text-slate-300 font-bold">{selectedStock.indicators.rsi}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden relative">
                          <div className="absolute left-[30%] right-[30%] top-0 bottom-0 bg-slate-900/80" />
                          <div 
                            className="absolute h-full w-2 bg-indigo-500 rounded-full" 
                            style={{ left: `${selectedStock.indicators.rsi}%` }}
                          />
                        </div>
                      </div>

                      {/* SMC order blocks lists */}
                      <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[9px]">
                        <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/10">
                          <span className="text-emerald-400 block font-bold mb-1">{t('bullishOb')}</span>
                          <span>${selectedStock.smartMoney.bullishOrderBlocks[0]?.price}</span>
                        </div>
                        <div className="bg-rose-500/5 p-2 rounded border border-rose-500/10">
                          <span className="text-rose-400 block font-bold mb-1">{t('bearishOb')}</span>
                          <span>${selectedStock.smartMoney.bearishOrderBlocks[0]?.price}</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 3: AI PREDICTION REPORT */}
              {activeMobileTab === 'forecast' && selectedStock && (
                <div className="space-y-4" dir={isArabic ? 'rtl' : 'ltr'}>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <Sparkles size={12} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-200">{t('aiQuantitativeForecast')}</h3>
                      <p className="text-[9px] text-indigo-400 font-mono">{t('realtimeCmt')}</p>
                    </div>
                  </div>

                  {!aiForecast && !isForecastPending ? (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-center space-y-3">
                      <p className="text-xs text-slate-400">
                        {t('reportDescription', { symbol: selectedStock.symbol })}
                      </p>
                      <button
                        onClick={handleGenerateForecast}
                        className="mx-auto flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all font-sans"
                        id="android-trigger-forecast"
                      >
                        <Sparkles size={11} /> {t('generateReport')}
                      </button>
                    </div>
                  ) : isForecastPending ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-slate-900/20 border border-slate-850 rounded-xl">
                      <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                      <p className="text-xs text-slate-400">{t('geminiScanning')}</p>
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 shadow-inner" id="android-forecast-report-view">
                      <MarkdownView text={aiForecast || ''} />
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: MENTOR COACH CHAT */}
              {activeMobileTab === 'mentor' && (
                <div className="flex-1 h-full w-full">
                  <CopilotChat 
                    stock={selectedStock}
                    messages={chatMessages}
                    onSendMessage={handleSendCopilotMessage}
                    isPending={isChatPending}
                    onClearChat={handleClearChat}
                    lang={currentLanguage}
                    className="h-full rounded-none border-0 bg-transparent shadow-none"
                  />
                </div>
              )}

            </div>

            {/* Android Navigation Bottom Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-slate-950/95 border-t border-slate-900 px-4 py-2 flex justify-around items-center z-50" dir={isArabic ? 'rtl' : 'ltr'}>
              
              <button
                onClick={() => setActiveMobileTab('scanner')}
                className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                  activeMobileTab === 'scanner' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}
                id="android-nav-scanner"
              >
                <Layers size={16} />
                <span>{t('scanner')}</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('chart')}
                className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                  activeMobileTab === 'chart' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}
                id="android-nav-chart"
              >
                <Activity size={16} />
                <span>{t('tradeChart')}</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('forecast')}
                className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                  activeMobileTab === 'forecast' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}
                id="android-nav-forecast"
              >
                <Sparkles size={16} />
                <span>{t('aiPredict')}</span>
              </button>

              <button
                onClick={() => setActiveMobileTab('mentor')}
                className={`flex flex-col items-center gap-1 text-[10px] transition-colors ${
                  activeMobileTab === 'mentor' ? 'text-indigo-400 font-extrabold' : 'text-slate-500'
                }`}
                id="android-nav-mentor"
              >
                <Bot size={16} />
                <span>{t('mentor')}</span>
              </button>

            </div>

            {/* Android Home Pill Indicator */}
            {!isMobileDevice && (
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-800 rounded-full" />
            )}

          </div>
        </div>
      ) : (
        /* Render Desktop View */
        <>
          {/* Top Navigation / Status Header Bar */}
          <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 px-4 md:px-6 py-3.5 flex flex-wrap justify-between items-center gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-500/20">
                <Activity className="animate-pulse" size={20} id="system-heartbeat" />
              </div>
              <div>
                <h1 className="text-base font-black tracking-tight text-white flex items-center gap-1.5" id="app-title-main">
                  {t('appTitle')} <span className="text-indigo-400 font-medium text-xs border border-indigo-500/30 px-1.5 py-0.5 rounded-md bg-indigo-500/10 uppercase font-mono">{isArabic ? 'كمي برو' : 'QUANT PRO'}</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">
                  {t('appSubtitle')}
                </p>
                {/* Language Switcher */}
                <div className="flex items-center gap-1.5 mt-2 select-none">
                  <button
                    onClick={() => setCurrentLanguage('en')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all border ${
                      currentLanguage === 'en'
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-500 border-slate-900/60 hover:text-slate-300'
                    }`}
                    id="desktop-lang-en"
                  >
                    English
                  </button>
                  <button
                    onClick={() => setCurrentLanguage('ar')}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold transition-all border ${
                      currentLanguage === 'ar'
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40 shadow-sm'
                        : 'bg-slate-950/60 text-slate-500 border-slate-900/60 hover:text-slate-300'
                    }`}
                    id="desktop-lang-ar"
                  >
                    العربية
                  </button>
                </div>
              </div>
            </div>

            {/* Global Stats / Simulation Header ticker */}
            <div className="flex flex-wrap items-center gap-5 font-mono text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-slate-200 font-semibold">{isArabic ? 'جلسة تداول مباشرة نشطة' : marketStatus}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock size={13} className="text-indigo-400" />
                <span>{currentTime} {isArabic ? 'بتوقيت نيويورك' : 'EST'}</span>
              </div>
            </div>
          </header>

          {/* Main Container Dashboard */}
          <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
            {hasFetchError && (
              <div className="col-span-full bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-3 text-amber-400 text-sm animate-pulse" dir={isArabic ? 'rtl' : 'ltr'}>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-ping shrink-0" />
                <p className="font-semibold">
                  {isArabic 
                    ? 'جاري محاولة إعادة الاتصال بموجز البيانات المباشر للأسهم (يرجى التأكد من استقرار الخادم)...' 
                    : 'Connecting: Reconnecting to the live stock data feed (please ensure the server is healthy)...'}
                </p>
              </div>
            )}
            
            {/* Left Column: Market Scanner Ticker List */}
            <div className="lg:col-span-1 flex flex-col gap-4" dir={isArabic ? 'rtl' : 'ltr'}>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-sm flex flex-col h-[520px] lg:h-[720px]">
                <div className="mb-4">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                    <Layers size={13} /> {t('activeScanner')}
                  </h2>
                  
                  {/* Search Bar */}
                  <div className="relative mb-3">
                    <Search className={`absolute ${isArabic ? 'right-3' : 'left-3'} top-3 text-slate-500`} size={14} />
                    <input
                      type="text"
                      placeholder={t('searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full bg-slate-950 border border-slate-800 hover:border-slate-700 focus:border-indigo-500 focus:outline-none rounded-xl ${isArabic ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 text-xs text-slate-300 placeholder-slate-600 transition-colors`}
                      id="scanner-search-input"
                    />
                  </div>

                  {/* Watchlist Folders on Desktop */}
                  <div className="mb-3.5 select-none">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                      {isArabic ? 'مجلدات الأسهم المخصصة' : 'CUSTOM WATCHLIST FOLDERS'}
                    </span>
                    <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                      {WATCHLISTS.map((wl) => {
                        const isSelected = activeWatchlist === wl.id;
                        return (
                          <button
                            key={wl.id}
                            onClick={() => {
                              setActiveWatchlist(wl.id);
                              if (wl.id !== 'ALL') setMarketFilter('ALL');
                            }}
                            className={`flex items-center gap-1 shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${
                              isSelected
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-md shadow-amber-500/5'
                                : 'bg-slate-950/40 text-slate-500 border-slate-800/60 hover:text-slate-200 hover:border-slate-700'
                            }`}
                            id={`wl-folder-desktop-${wl.id}`}
                          >
                            {wl.id === 'ALL' ? (
                              <Layers size={9} className="text-indigo-400" />
                            ) : (
                              <Folder size={9} className={isSelected ? 'text-amber-400 fill-amber-400/20' : 'text-amber-500/60'} />
                            )}
                            <span>{isArabic ? wl.labelAr : wl.labelEn}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Exchange Category Tabs */}
                  <div className="grid grid-cols-5 gap-1">
                    {(['ALL', 'NYSE', 'NASDAQ', 'AMEX', 'FOREX'] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMarketFilter(m)}
                        className={`text-[9px] font-bold font-mono py-1 rounded-md transition-all ${
                          marketFilter === m 
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                            : 'bg-slate-950/40 text-slate-500 border border-slate-800/60 hover:text-slate-300'
                        }`}
                        id={`filter-tab-${m}`}
                      >
                        {m === 'ALL' ? t('all') : m === 'FOREX' ? t('forex') : m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* List area */}
                <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                  {filteredStocks.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      {t('noMatchingTickers')}
                    </div>
                  ) : (
                    filteredStocks.map((st) => {
                      const isSelected = selectedStock?.symbol === st.symbol;
                      const flash = priceFlash[st.symbol];
                      
                      return (
                        <button
                          key={st.symbol}
                          onClick={() => setSelectedStock(st)}
                          className={`w-full text-left rounded-xl p-3 border transition-all ${
                            isSelected 
                              ? 'bg-indigo-600/10 border-indigo-500/40 shadow-md shadow-indigo-600/5' 
                              : 'bg-slate-950/40 border-slate-800/60 hover:border-slate-700/80 hover:bg-slate-900/30'
                          }`}
                          id={`stock-row-${st.symbol}`}
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-slate-100 font-mono tracking-tight">{st.symbol}</span>
                              <span className="text-[9px] text-slate-500 truncate max-w-[80px] font-medium">{st.name}</span>
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full font-mono ${
                              st.signal.type.includes('BUY') ? 'bg-emerald-500/10 text-emerald-400' :
                              st.signal.type.includes('SELL') ? 'bg-rose-500/10 text-rose-400' :
                              'bg-slate-800 text-slate-400'
                            }`}>
                              {st.signal.type.replace('STRONG_', 'S ')}
                            </span>
                          </div>

                          <div className="flex justify-between items-center font-mono" dir="ltr">
                            <span className={`text-xs font-extrabold transition-all duration-300 ${
                              flash === 'up' ? 'text-emerald-400 scale-105' :
                              flash === 'down' ? 'text-rose-400 scale-105' :
                              'text-slate-300'
                            }`}>
                              ${st.price.toFixed(st.price < 5 ? 4 : 2)}
                            </span>
                            
                            <div className="flex items-center gap-1 text-[11px]">
                              {st.change >= 0 ? (
                                <TrendingUp size={11} className="text-emerald-400" />
                              ) : (
                                <TrendingDown size={11} className="text-rose-400" />
                              )}
                              <span className={st.change >= 0 ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                                {st.change >= 0 ? '+' : ''}{st.change.toFixed(2)}%
                              </span>
                            </div>
                          </div>

                          {st.moneyFlow && (
                            <div className="flex justify-between items-center text-[9px] mt-1.5 pt-1.5 border-t border-slate-800/30 text-slate-500 font-mono" dir="ltr">
                              <span className="text-slate-500">{isArabic ? 'السيولة الحية:' : 'Live Liquidity:'}</span>
                              <span className={`font-bold ${st.moneyFlow.netFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {st.moneyFlow.netFlow >= 0 ? '▲ +' : '▼ '}${st.moneyFlow.netFlow}M ({st.moneyFlow.ratio}%)
                              </span>
                            </div>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Center/Right Workspace: active stock metrics, chart, signals, forecasts */}
            <div className="lg:col-span-3 grid grid-cols-1 xl:grid-cols-3 gap-6" dir={isArabic ? 'rtl' : 'ltr'}>
              
              {/* Main Stock Analysis Area */}
              <div className="xl:col-span-2 flex flex-col gap-6">
                
                {/* Active Stock Quote Banner */}
                {selectedStock && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                        <span className="text-lg font-black tracking-wider font-mono">{selectedStock.symbol}</span>
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-white tracking-tight leading-none mb-1">{selectedStock.name}</h2>
                        <span className="text-xs text-slate-400 font-mono">{t('indicatorConvergence')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right font-mono" dir="ltr">
                        <span className="text-2xl font-black text-slate-100 tracking-tight block">
                          ${selectedStock.price.toFixed(selectedStock.price < 5 ? 4 : 2)}
                        </span>
                        <div className="flex items-center gap-1 justify-end text-xs">
                          {selectedStock.change >= 0 ? (
                            <TrendingUp size={13} className="text-emerald-400" />
                          ) : (
                            <TrendingDown size={13} className="text-rose-400" />
                          )}
                          <span className={selectedStock.change >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                            {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
                          </span>
                        </div>
                      </div>

                      {/* AI Forecast button */}
                      <button
                        onClick={handleGenerateForecast}
                        disabled={isForecastPending}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:from-indigo-700 active:to-violet-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-indigo-600/10 font-sans"
                        id="trigger-forecast-btn"
                      >
                        {isForecastPending ? (
                          <>
                            <RefreshCw size={13} className="animate-spin" />
                            {t('analyzingStructure')}
                          </>
                        ) : (
                          <>
                            <Sparkles size={13} />
                            {t('runAiPrediction')}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Price Chart */}
                {selectedStock && activeHistory.length > 0 ? (
                  <PriceChart 
                    symbol={selectedStock.symbol} 
                    history={activeHistory} 
                    stock={selectedStock} 
                  />
                ) : (
                  <div className="h-[350px] bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 text-xs">
                    {isArabic ? 'جاري الاتصال بقنوات البث الحية...' : 'Generating live candle data stream...'}
                  </div>
                )}

                {/* Smart Money & Indicators metrics row */}
                {selectedStock && <MarketDetails stock={selectedStock} lang={currentLanguage} />}

                {/* AI Generated Forecast Card */}
                {selectedStock && (aiForecast || isForecastPending) && (
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 shadow-xl backdrop-blur-md">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                      <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                        <FileText size={15} />
                      </div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">{t('reportTitle')}</h3>
                        <p className="text-[10px] text-indigo-400">{t('reportModel')}</p>
                      </div>
                    </div>

                    {isForecastPending ? (
                      <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-xs text-slate-400">{t('compilingTape')}</p>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 border border-slate-800/40 rounded-xl p-4 shadow-inner" id="forecast-output-view">
                        <MarkdownView text={aiForecast || ''} />
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* Right Side: Mentor Copilot Panel */}
              <div className="xl:col-span-1">
                <CopilotChat 
                  stock={selectedStock}
                  messages={chatMessages}
                  onSendMessage={handleSendCopilotMessage}
                  isPending={isChatPending}
                  onClearChat={handleClearChat}
                  lang={currentLanguage}
                />
              </div>

            </div>

          </main>

          {/* Humble craft footer bar */}
          <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs font-mono text-slate-500 mt-10" dir={isArabic ? 'rtl' : 'ltr'}>
            <div>
              <span>{t('systemActive')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{t('secureCloud')}</span>
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            </div>
          </footer>
        </>
      )}

    </div>
  );
}
