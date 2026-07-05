export interface Candlestick {
  time: string; // ISO string or simple time string
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  quantity: number;
  type: 'bid' | 'ask';
}

export interface OrderBook {
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface SmartMoneyMetrics {
  bullishOrderBlocks: { price: number; volume: number; age: number }[];
  bearishOrderBlocks: { price: number; volume: number; age: number }[];
  liquidityPools: { price: number; type: 'buy_side' | 'sell_side'; size: number }[];
  recentSweeps: { price: number; type: string; timestamp: string }[];
}

export interface TechIndicators {
  rsi: number;
  macd: {
    macdLine: number;
    signalLine: number;
    histogram: number;
  };
  ema20: number;
  ema50: number;
  ema200: number;
}

export interface RiskManagement {
  entry: number;
  stopLoss: number;
  takeProfit1: number;
  takeProfit2: number;
  takeProfit3: number;
  riskRewardRatio: number;
}

export interface TradingSignal {
  symbol: string;
  type: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  setup: string; // e.g., "Bullish Order Block Sweep + RSI Oversold"
  timestamp: string;
  riskManagement: RiskManagement;
}

export interface MoneyFlow {
  inflow: number;     // Inflow liquidity in Millions USD/Units
  outflow: number;    // Outflow liquidity in Millions USD/Units
  netFlow: number;    // Net incoming liquidity (inflow - outflow) in Millions USD/Units
  ratio: number;      // Net incoming liquidity ratio as percentage of total flow
}

export interface StockData {
  symbol: string;
  name: string;
  exchange?: 'NYSE' | 'NASDAQ' | 'AMEX' | 'FOREX';
  watchlist?: string;
  price: number;
  change: number; // Percentage change
  changeAmt: number; // Absolute dollar change
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  avgVolume: number;
  orderBook: OrderBook;
  smartMoney: SmartMoneyMetrics;
  indicators: TechIndicators;
  signal: TradingSignal;
  moneyFlow?: MoneyFlow;
  predictions?: {
    daily: { bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL'; confidence: number; reasoning: string };
    multiTimeframe: {
      day: { trend: 'UP' | 'DOWN' | 'SIDEWAYS'; priceTarget: number };
      week: { trend: 'UP' | 'DOWN' | 'SIDEWAYS'; priceTarget: number };
      month: { trend: 'UP' | 'DOWN' | 'SIDEWAYS'; priceTarget: number };
    };
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
