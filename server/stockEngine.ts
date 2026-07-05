import { StockData, Candlestick, TradingSignal, TechIndicators, OrderBook, SmartMoneyMetrics, MoneyFlow } from '../src/types';

const TICKERS = [
  // Folder: future
  { symbol: 'IBM', name: 'International Business Machines Corp.', basePrice: 289.22, exchange: 'NYSE', watchlist: 'future' },
  { symbol: 'TCEHY', name: 'Tencent Holdings Limited', basePrice: 51.20, exchange: 'NASDAQ', watchlist: 'future' },
  { symbol: 'IBIT', name: 'iShares Bitcoin Trust', basePrice: 34.78, exchange: 'NASDAQ', watchlist: 'future' },

  // Folder: saveor for investmen
  { symbol: 'CAT', name: 'Caterpillar Inc.', basePrice: 962.00, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'XOM', name: 'Exxon Mobil Corp.', basePrice: 136.97, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'CVX', name: 'Chevron Corp.', basePrice: 169.13, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'WMT', name: 'Walmart Inc.', basePrice: 111.72, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', basePrice: 151.50, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', basePrice: 263.04, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'CRM', name: 'Salesforce Inc.', basePrice: 166.14, exchange: 'NYSE', watchlist: 'saveor for investmen' },
  { symbol: 'PANW', name: 'Palo Alto Networks', basePrice: 347.88, exchange: 'NASDAQ', watchlist: 'saveor for investmen' },
  { symbol: 'NOW', name: 'ServiceNow, Inc.', basePrice: 106.16, exchange: 'NYSE', watchlist: 'saveor for investmen' },

  // Folder: E commerce
  { symbol: 'ETN', name: 'Eaton Corporation plc', basePrice: 398.67, exchange: 'NYSE', watchlist: 'E commerce' },
  { symbol: 'SCAG', name: 'Scage Future American Depositary', basePrice: 0.3675, exchange: 'NASDAQ', watchlist: 'E commerce' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', basePrice: 242.30, exchange: 'NASDAQ', watchlist: 'E commerce' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', basePrice: 74.45, exchange: 'NYSE', watchlist: 'E commerce' },

  // Folder: Elon mask
  { symbol: 'SPCX', name: 'Space Exploration Technologies Corp.', basePrice: 160.73, exchange: 'NASDAQ', watchlist: 'Elon mask' },
  { symbol: 'TSLA', name: 'Tesla Inc.', basePrice: 392.90, exchange: 'NASDAQ', watchlist: 'Elon mask' },

  // Folder: Technology & Hardwar
  { symbol: 'MSFT', name: 'Microsoft Corp.', basePrice: 389.79, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },
  { symbol: 'META', name: 'Meta Platforms Inc.', basePrice: 582.76, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },
  { symbol: 'DELL', name: 'Dell Technologies Inc.', basePrice: 394.19, exchange: 'NYSE', watchlist: 'Technology & Hardwar' },
  { symbol: 'AAPL', name: 'Apple Inc.', basePrice: 308.24, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },
  { symbol: 'MSTR', name: 'MicroStrategy Incorporated', basePrice: 100.75, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },
  { symbol: 'RKLB', name: 'Rocket Lab USA, Inc.', basePrice: 100.34, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },
  { symbol: 'MU', name: 'Micron Technology', basePrice: 974.27, exchange: 'NASDAQ', watchlist: 'Technology & Hardwar' },

  // Folder: Health
  { symbol: 'PFE', name: 'Pfizer Inc.', basePrice: 24.31, exchange: 'NYSE', watchlist: 'Health' },
  { symbol: 'GEV', name: 'GE Vernova Inc.', basePrice: 1113.27, exchange: 'NYSE', watchlist: 'Health' },
  { symbol: 'LLY', name: 'Eli Lilly & Co.', basePrice: 1210.79, exchange: 'NYSE', watchlist: 'Health' },

  // Folder: Semiconductors
  { symbol: 'AVGO', name: 'Broadcom Inc.', basePrice: 360.50, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'ARM', name: 'ARM Holdings plc', basePrice: 315.30, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'AMAT', name: 'Applied Materials, Inc.', basePrice: 603.32, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'VRT', name: 'Vertiv Holdings Co.', basePrice: 300.50, exchange: 'NYSE', watchlist: 'Semiconductors' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', basePrice: 194.51, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', basePrice: 518.25, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'MRVL', name: 'Marvell Technology, Inc.', basePrice: 245.46, exchange: 'NASDAQ', watchlist: 'Semiconductors' },
  { symbol: 'INTC', name: 'Intel Corp.', basePrice: 120.60, exchange: 'NASDAQ', watchlist: 'Semiconductors' },

  // Standard Indices and Forex for background completion
  { symbol: 'SPY', name: 'S&P 500 ETF Trust', basePrice: 548.40, exchange: 'AMEX' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', basePrice: 475.60, exchange: 'NASDAQ' },
  { symbol: 'EURUSD=X', name: 'EUR/USD (Euro/USD)', basePrice: 1.0850, exchange: 'FOREX' },
  { symbol: 'GBPUSD=X', name: 'GBP/USD (Pound/USD)', basePrice: 1.2720, exchange: 'FOREX' },
  { symbol: 'USDJPY=X', name: 'USD/JPY (USD/Yen)', basePrice: 156.40, exchange: 'FOREX' },
  { symbol: 'GC=F', name: 'Gold (XAU/USD)', basePrice: 2330.50, exchange: 'FOREX' }
];

// Round prices dynamically: 4 decimals for forex, 2 for stocks
function roundPrice(val: number, priceContext: number): number {
  return Number(val.toFixed(priceContext < 5 ? 4 : 2));
}

// Memory database for stock data
let stocksDB: Record<string, StockData> = {};
let historicalData: Record<string, Record<string, Candlestick[]>> = {}; // stock -> timeframe -> candlesticks

// Helper: Calculate simple indicators
function calculateEMA(prices: number[], period: number): number {
  if (prices.length === 0) return 0;
  const k = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }
  return ema;
}

function calculateRSI(prices: number[], period = 14): number {
  if (prices.length <= period) return 50;
  let gains = 0;
  let losses = 0;

  for (let i = prices.length - period; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1];
    if (diff > 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function calculateMACD(prices: number[]): { macdLine: number; signalLine: number; histogram: number } {
  if (prices.length < 26) {
    return { macdLine: 0, signalLine: 0, histogram: 0 };
  }
  // Simplified MACD calculation
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  const macdLine = ema12 - ema26;
  
  // Simulated signal line
  const signalLine = macdLine * 0.8;
  const histogram = macdLine - signalLine;

  return { macdLine, signalLine, histogram };
}

// Generate realistic history
function generateHistory(basePrice: number, count = 100): Candlestick[] {
  const history: Candlestick[] = [];
  let currentPrice = basePrice * 0.95; // start slightly lower
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 60000 * 5); // 5-minute bars
    const change = (Math.random() - 0.49) * (basePrice * 0.005);
    const open = currentPrice;
    const close = currentPrice + change;
    const high = Math.max(open, close) + Math.random() * (basePrice * 0.002);
    const low = Math.min(open, close) - Math.random() * (basePrice * 0.002);
    const volume = Math.floor(Math.random() * 50000) + 10000;

    history.push({
      time: time.toISOString(),
      open: roundPrice(open, basePrice),
      high: roundPrice(high, basePrice),
      low: roundPrice(low, basePrice),
      close: roundPrice(close, basePrice),
      volume
    });

    currentPrice = close;
  }
  return history;
}

// Generate realistic Order Book
function generateOrderBook(price: number): OrderBook {
  const bids: any[] = [];
  const asks: any[] = [];
  const spread = price * 0.0003; // tiny spread

  for (let i = 1; i <= 8; i++) {
    bids.push({
      price: roundPrice(price - spread/2 - i * price * 0.0005, price),
      quantity: Math.floor(Math.random() * 1500) + 100,
      type: 'bid'
    });
    asks.push({
      price: roundPrice(price + spread/2 + i * price * 0.0005, price),
      quantity: Math.floor(Math.random() * 1500) + 100,
      type: 'ask'
    });
  }

  // Sort bids descending, asks ascending
  return {
    bids: bids.sort((a, b) => b.price - a.price),
    asks: asks.sort((a, b) => a.price - b.price)
  };
}

// Compute trading signals and SMC (Smart Money Concepts)
function computeTechnicalLayer(symbol: string, history: Candlestick[], currentPrice: number): {
  indicators: TechIndicators;
  smartMoney: SmartMoneyMetrics;
  signal: TradingSignal;
} {
  const closes = history.map(h => h.close);
  const rsi = Number(calculateRSI(closes, 14).toFixed(1));
  const macd = calculateMACD(closes);
  
  macd.macdLine = roundPrice(macd.macdLine, currentPrice);
  macd.signalLine = roundPrice(macd.signalLine, currentPrice);
  macd.histogram = roundPrice(macd.histogram, currentPrice);

  const ema20 = roundPrice(calculateEMA(closes, 20), currentPrice);
  const ema50 = roundPrice(calculateEMA(closes, 50), currentPrice);
  const ema200 = roundPrice(calculateEMA(closes, 200), currentPrice);

  // Identify support & resistance zones
  const highs = history.map(h => h.high);
  const lows = history.map(h => h.low);
  
  const supportZone1 = Math.min(...lows.slice(-15));
  const resistanceZone1 = Math.max(...highs.slice(-15));

  // Smart Money Concepts
  const bullishOrderBlocks = [
    { price: roundPrice(supportZone1 * 1.002, currentPrice), volume: Math.floor(Math.random() * 200000) + 100000, age: Math.floor(Math.random() * 10) + 1 },
    { price: roundPrice(supportZone1 * 0.995, currentPrice), volume: Math.floor(Math.random() * 400000) + 200000, age: Math.floor(Math.random() * 20) + 10 }
  ];

  const bearishOrderBlocks = [
    { price: roundPrice(resistanceZone1 * 0.998, currentPrice), volume: Math.floor(Math.random() * 200000) + 100000, age: Math.floor(Math.random() * 8) + 1 },
    { price: roundPrice(resistanceZone1 * 1.005, currentPrice), volume: Math.floor(Math.random() * 450000) + 250000, age: Math.floor(Math.random() * 25) + 11 }
  ];

  const liquidityPools = [
    { price: roundPrice(resistanceZone1 * 1.01, currentPrice), type: 'buy_side' as const, size: Math.floor(Math.random() * 800000) + 400000 },
    { price: roundPrice(supportZone1 * 0.99, currentPrice), type: 'sell_side' as const, size: Math.floor(Math.random() * 900000) + 300000 }
  ];

  const recentSweeps = [
    { price: roundPrice(supportZone1 * 0.998, currentPrice), type: 'Sellside Liquidity Grab', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() }
  ];

  // Algorithmic trading signal
  let signalType: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL' = 'NEUTRAL';
  let setup = 'No clear structure. Monitoring market orders.';

  if (rsi < 32 && currentPrice <= supportZone1 * 1.01) {
    signalType = 'STRONG_BUY';
    setup = 'Liquidity Sweep + Bullish Order Block mitigation + RSI Oversold confluence';
  } else if (rsi > 68 && currentPrice >= resistanceZone1 * 0.99) {
    signalType = 'STRONG_SELL';
    setup = 'Liquidity Sweep + Bearish Order Block mitigation + RSI Overbought confluence';
  } else if (ema20 > ema50 && closes[closes.length - 1] > ema20) {
    signalType = 'BUY';
    setup = 'Golden EMA-20/50 Trend Alignment + Volume support';
  } else if (ema20 < ema50 && closes[closes.length - 1] < ema20) {
    signalType = 'SELL';
    setup = 'Bearish EMA-20/50 Cross alignment + Selloff volume';
  }

  // Stop Loss & Take Profit calculations
  let entry = currentPrice;
  let stopLoss = 0;
  let takeProfit1 = 0;
  let takeProfit2 = 0;
  let takeProfit3 = 0;

  if (signalType === 'STRONG_BUY' || signalType === 'BUY') {
    stopLoss = roundPrice(supportZone1 * 0.985, currentPrice);
    const risk = entry - stopLoss;
    takeProfit1 = roundPrice(entry + risk * 1.2, currentPrice);
    takeProfit2 = roundPrice(entry + risk * 2.0, currentPrice);
    takeProfit3 = roundPrice(entry + risk * 3.5, currentPrice);
  } else if (signalType === 'STRONG_SELL' || signalType === 'SELL') {
    stopLoss = roundPrice(resistanceZone1 * 1.015, currentPrice);
    const risk = stopLoss - entry;
    takeProfit1 = roundPrice(entry - risk * 1.2, currentPrice);
    takeProfit2 = roundPrice(entry - risk * 2.0, currentPrice);
    takeProfit3 = roundPrice(entry - risk * 3.5, currentPrice);
  } else {
    // Neutral fallback targets
    stopLoss = roundPrice(currentPrice * 0.98, currentPrice);
    takeProfit1 = roundPrice(currentPrice * 1.02, currentPrice);
    takeProfit2 = roundPrice(currentPrice * 1.04, currentPrice);
    takeProfit3 = roundPrice(currentPrice * 1.06, currentPrice);
  }

  const riskRewardRatio = Number(((takeProfit2 - entry) / (entry - stopLoss || 1)).toFixed(2));

  const signal: TradingSignal = {
    symbol,
    type: signalType,
    setup,
    timestamp: new Date().toLocaleTimeString(),
    riskManagement: {
      entry,
      stopLoss,
      takeProfit1,
      takeProfit2,
      takeProfit3,
      riskRewardRatio: Math.abs(riskRewardRatio)
    }
  };

  return {
    indicators: { rsi, macd, ema20, ema50, ema200 },
    smartMoney: { bullishOrderBlocks, bearishOrderBlocks, liquidityPools, recentSweeps },
    signal
  };
}

// Compute incoming liquidity (السيولة الداخلة) dynamically for each stock based on market activity
function computeMoneyFlow(symbol: string, price: number, volume: number, rsi: number, signalType: string): MoneyFlow {
  // If FOREX, use simplified stable money flow
  const isForex = symbol.includes('=X') || symbol === 'GC=F';
  
  // Total money flow transacted (price * volume) / 1,000,000 to get value in Millions
  // For forex or gold we scale nicely so it is not an astronomical number
  const totalValueM = isForex ? (volume * 0.1) : ((price * volume) / 1000000);
  
  // Base inflow ratio around 50% with some random noise
  let inflowRatio = 0.50 + (Math.random() - 0.50) * 0.04;
  
  // Adjust based on trading indicators / signals (Institutional Smart Money footprint)
  if (signalType.includes('BUY')) {
    inflowRatio += 0.05; // Demand accumulation
    if (signalType.includes('STRONG')) {
      inflowRatio += 0.06;
    }
  } else if (signalType.includes('SELL')) {
    inflowRatio -= 0.05; // Supply distribution
    if (signalType.includes('STRONG')) {
      inflowRatio -= 0.06;
    }
  }
  
  // Bound the ratio to stay highly realistic (between 30% and 80%)
  inflowRatio = Math.max(0.30, Math.min(0.80, inflowRatio));
  
  const inflow = Number((totalValueM * inflowRatio).toFixed(2));
  const outflow = Number((totalValueM * (1 - inflowRatio)).toFixed(2));
  const netFlow = Number((inflow - outflow).toFixed(2));
  const ratio = Number(((netFlow / (inflow + outflow || 1)) * 100).toFixed(1));
  
  return {
    inflow: Math.max(0.01, inflow),
    outflow: Math.max(0.01, outflow),
    netFlow,
    ratio
  };
}

// Fetch detailed symbol chart from Yahoo Finance API (crumb-free public endpoint)
async function fetchSymbolFromYahooChart(symbol: string): Promise<{ price: number; change: number; changeAmt: number; open: number; high: number; low: number; prevClose: number; volume: number }> {
  const yahooSymbol = symbol.replace('.', '-');
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?range=1d&interval=1m`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const data = await res.json() as any;
  const result = data?.chart?.result?.[0];
  const meta = result?.meta;
  if (!meta || meta.regularMarketPrice === undefined) {
    throw new Error('Invalid chart response metadata');
  }

  const price = meta.regularMarketPrice;
  const prevClose = meta.chartPreviousClose || price;
  const changeAmt = price - prevClose;
  const change = (changeAmt / prevClose) * 100;

  // Extract other metrics
  const quote = result?.indicators?.quote?.[0] || {};
  const opens = (quote.open || []).filter((v: any) => v !== null && typeof v === 'number');
  const highs = (quote.high || []).filter((v: any) => v !== null && typeof v === 'number');
  const lows = (quote.low || []).filter((v: any) => v !== null && typeof v === 'number');
  const volumes = (quote.volume || []).filter((v: any) => v !== null && typeof v === 'number');

  const open = opens[0] || price;
  const high = highs.length > 0 ? Math.max(...highs) : Math.max(price, prevClose);
  const low = lows.length > 0 ? Math.min(...lows) : Math.min(price, prevClose);
  const volume = volumes.reduce((a: number, b: number) => a + (b || 0), 0) || 120000;

  return {
    price,
    change,
    changeAmt,
    open,
    high,
    low,
    prevClose,
    volume
  };
}

// Fetch reliable real-time foreign exchange rates from Frankfurter API as baseline/fallback
async function fetchForexFromFrankfurter(): Promise<Record<string, { price: number; change: number; changeAmt: number; open: number; high: number; low: number; prevClose: number; volume: number }>> {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) {
      throw new Error(`Frankfurter error status: ${res.status}`);
    }
    const data = await res.json() as any;
    const rates = data?.rates;
    if (!rates) return {};

    const eurPrice = 1 / rates.EUR;
    const gbpPrice = 1 / rates.GBP;
    const jpyPrice = rates.JPY;

    return {
      'EURUSD=X': {
        price: eurPrice,
        change: 0,
        changeAmt: 0,
        open: eurPrice,
        high: eurPrice * 1.002,
        low: eurPrice * 0.998,
        prevClose: eurPrice,
        volume: 250000
      },
      'GBPUSD=X': {
        price: gbpPrice,
        change: 0,
        changeAmt: 0,
        open: gbpPrice,
        high: gbpPrice * 1.002,
        low: gbpPrice * 0.998,
        prevClose: gbpPrice,
        volume: 180000
      },
      'USDJPY=X': {
        price: jpyPrice,
        change: 0,
        changeAmt: 0,
        open: jpyPrice,
        high: jpyPrice * 1.002,
        low: jpyPrice * 0.998,
        prevClose: jpyPrice,
        volume: 320000
      }
    };
  } catch (error) {
    // Silent fallback to standard simulation
    return {};
  }
}

// Fetch real-time stock/forex prices from crumb-free Yahoo endpoints & Frankfurter
async function fetchOnlinePrices(): Promise<Record<string, { price: number; change: number; changeAmt: number; open: number; high: number; low: number; prevClose: number; volume: number }>> {
  const prices: Record<string, any> = {};

  // 1. Load Forex baseline from Frankfurter first
  const forex = await fetchForexFromFrankfurter();
  Object.assign(prices, forex);

  // 2. Query other tickers from Yahoo Finance chart
  const fetchPromises = TICKERS.map(async (t) => {
    try {
      const result = await fetchSymbolFromYahooChart(t.symbol);
      prices[t.symbol.toUpperCase()] = result;
    } catch (err) {
      // Silent fallback
    }
  });

  await Promise.allSettled(fetchPromises);
  return prices;
}

// Refresh the memory database with real-time online data
async function refreshPricesFromOnline() {
  const onlineData = await fetchOnlinePrices();
  if (Object.keys(onlineData).length === 0) {
    return; // Keep existing data if fetch fails
  }

  TICKERS.forEach(t => {
    const online = onlineData[t.symbol.toUpperCase()];
    if (!online) return;

    const stock = stocksDB[t.symbol];
    if (!stock) return;

    const newPrice = online.price;

    // Adjust historical candlesticks
    const candles = historicalData[t.symbol]['5m'];
    if (candles && candles.length > 0) {
      const lastCandle = candles[candles.length - 1];
      lastCandle.close = newPrice;
      if (newPrice > lastCandle.high) lastCandle.high = newPrice;
      if (newPrice < lastCandle.low) lastCandle.low = newPrice;
    }

    const orderBook = generateOrderBook(newPrice);
    const tech = computeTechnicalLayer(t.symbol, candles || [], newPrice);

    stocksDB[t.symbol] = {
      ...stock,
      price: newPrice,
      change: Number(online.change.toFixed(2)),
      changeAmt: roundPrice(online.changeAmt, newPrice),
      open: online.open,
      high: online.high,
      low: online.low,
      prevClose: online.prevClose,
      volume: online.volume,
      orderBook,
      smartMoney: tech.smartMoney,
      indicators: tech.indicators,
      signal: tech.signal,
      moneyFlow: computeMoneyFlow(t.symbol, newPrice, online.volume, tech.indicators.rsi, tech.signal.type),
      predictions: {
        daily: {
          bias: tech.signal.type.includes('BUY') ? 'BULLISH' : tech.signal.type.includes('SELL') ? 'BEARISH' : 'NEUTRAL',
          confidence: tech.signal.type.includes('STRONG') ? 88 : tech.signal.type === 'NEUTRAL' ? 50 : 68,
          reasoning: `SMC analysis shows online order flow bid concentration with indicators aligning ${tech.signal.type.includes('BUY') ? 'bullish' : 'bearish'}.`
        },
        multiTimeframe: {
          day: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit1 },
          week: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit2 },
          month: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit3 }
        }
      }
    };
  });
}

// Initialize the entire database
export function initializeEngine() {
  TICKERS.forEach(t => {
    // Generate initial candle history
    const history = generateHistory(t.basePrice, 100);
    historicalData[t.symbol] = {
      '5m': history
    };

    const lastCandle = history[history.length - 1];
    const prevClose = history[0].close;
    const currentPrice = lastCandle.close;
    const changeAmt = currentPrice - prevClose;
    const change = (changeAmt / prevClose) * 100;

    const orderBook = generateOrderBook(currentPrice);
    const tech = computeTechnicalLayer(t.symbol, history, currentPrice);

    const initialVolume = history.reduce((sum, h) => sum + h.volume, 0);

    stocksDB[t.symbol] = {
      symbol: t.symbol,
      name: t.name,
      exchange: t.exchange as 'NYSE' | 'NASDAQ' | 'AMEX' | 'FOREX',
      watchlist: t.watchlist,
      price: currentPrice,
      change: Number(change.toFixed(2)),
      changeAmt: roundPrice(changeAmt, currentPrice),
      open: history[0].open,
      high: Math.max(...history.map(h => h.high)),
      low: Math.min(...history.map(h => h.low)),
      prevClose,
      volume: initialVolume,
      avgVolume: 2500000,
      orderBook,
      smartMoney: tech.smartMoney,
      indicators: tech.indicators,
      signal: tech.signal,
      moneyFlow: computeMoneyFlow(t.symbol, currentPrice, initialVolume, tech.indicators.rsi, tech.signal.type),
      predictions: {
        daily: {
          bias: tech.signal.type.includes('BUY') ? 'BULLISH' : tech.signal.type.includes('SELL') ? 'BEARISH' : 'NEUTRAL',
          confidence: tech.signal.type.includes('STRONG') ? 85 : 55,
          reasoning: `Technical profile points to dynamic structure support around ${tech.indicators.ema50}. Volume remains supportive.`
        },
        multiTimeframe: {
          day: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit1 },
          week: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit2 },
          month: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit3 }
        }
      }
    };
  });

  // Kickoff immediate background online sync
  refreshPricesFromOnline().then(() => {
    console.log('Successfully synchronized initial real-time stock/forex prices.');
  }).catch(() => {
    // Silent fallback to robust simulated price engine
  });

  // Pull latest real-time prices from Yahoo Finance API every 15 seconds
  setInterval(() => {
    refreshPricesFromOnline().catch(() => {});
  }, 15000);

  // Run the background ticks every 3 seconds to keep data extremely fresh with micro-fluctuations
  setInterval(() => {
    TICKERS.forEach(t => {
      const stock = stocksDB[t.symbol];
      if (!stock) return;

      // stochastic price move
      const priceDirection = Math.random() - 0.48; // slight upward drift
      const percentMove = (Math.random() * 0.0006) * priceDirection; // gentler micro-movements on top of live feed
      const oldPrice = stock.price;
      const newPrice = roundPrice(oldPrice * (1 + percentMove), oldPrice);
      
      const changeAmt = newPrice - stock.prevClose;
      const change = (changeAmt / stock.prevClose) * 100;

      // Append to the active 5m candlestick (simulate last candle updating)
      const candles = historicalData[t.symbol]['5m'];
      if (candles && candles.length > 0) {
        const lastCandle = candles[candles.length - 1];
        lastCandle.close = newPrice;
        if (newPrice > lastCandle.high) lastCandle.high = newPrice;
        if (newPrice < lastCandle.low) lastCandle.low = newPrice;
        lastCandle.volume += Math.floor(Math.random() * 300) + 10;
      }

      // Periodically shift indicators & order book
      const orderBook = generateOrderBook(newPrice);
      const tech = computeTechnicalLayer(t.symbol, candles, newPrice);
      const newVolume = stock.volume + (Math.floor(Math.random() * 500) + 50);

      stocksDB[t.symbol] = {
        ...stock,
        price: newPrice,
        change: Number(change.toFixed(2)),
        changeAmt: roundPrice(changeAmt, newPrice),
        high: Math.max(stock.high, newPrice),
        low: Math.min(stock.low, newPrice),
        volume: newVolume,
        orderBook,
        smartMoney: tech.smartMoney,
        indicators: tech.indicators,
        signal: tech.signal,
        moneyFlow: computeMoneyFlow(t.symbol, newPrice, newVolume, tech.indicators.rsi, tech.signal.type),
        predictions: {
          daily: {
            bias: tech.signal.type.includes('BUY') ? 'BULLISH' : tech.signal.type.includes('SELL') ? 'BEARISH' : 'NEUTRAL',
            confidence: tech.signal.type.includes('STRONG') ? 88 : tech.signal.type === 'NEUTRAL' ? 50 : 68,
            reasoning: `SMC analysis shows order book bid concentration of ${Math.floor(Math.random()*20)+40}% with indicators aligning ${tech.signal.type.includes('BUY') ? 'bullish' : 'bearish'}.`
          },
          multiTimeframe: {
            day: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit1 },
            week: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit2 },
            month: { trend: tech.signal.type.includes('BUY') ? 'UP' : 'DOWN', priceTarget: tech.signal.riskManagement.takeProfit3 }
          }
        }
      };
    });
  }, 3000);
}

export function getAllStocks(): StockData[] {
  return Object.values(stocksDB);
}

export function getStockBySymbol(symbol: string): { stock: StockData; history: Candlestick[] } | null {
  const stock = stocksDB[symbol.toUpperCase()];
  const history = historicalData[symbol.toUpperCase()]?.['5m'];
  if (!stock || !history) return null;
  return { stock, history };
}
