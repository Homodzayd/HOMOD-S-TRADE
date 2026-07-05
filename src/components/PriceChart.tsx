import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Candlestick, StockData } from '../types';
import { Eye, EyeOff, TrendingUp, ShieldAlert, Crosshair } from 'lucide-react';

interface PriceChartProps {
  symbol: string;
  history: Candlestick[];
  stock: StockData;
}

export default function PriceChart({ symbol, history, stock }: PriceChartProps) {
  const [showEMAs, setShowEMAs] = useState(true);
  const [showSMC, setShowSMC] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<Candlestick | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 350 });

  const decimals = stock.price < 5 ? 4 : 2;

  // Update dimensions based on container
  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({
          width: Math.max(width, 300),
          height: Math.max(height, 280)
        });
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Limit visible candles to the last 40 for clean readability
  const visibleCandles = useMemo(() => {
    return history.slice(-40);
  }, [history]);

  // Calculate SVG limits
  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (visibleCandles.length === 0) return { minPrice: 0, maxPrice: 100, maxVolume: 100 };
    
    let min = Math.min(...visibleCandles.map(c => c.low));
    let max = Math.max(...visibleCandles.map(c => c.high));
    const vol = Math.max(...visibleCandles.map(c => c.volume));

    // Pad prices slightly
    const padding = (max - min) * 0.15 || 5;
    min = Math.max(0, min - padding);
    max = max + padding;

    // Incorporate stop loss and take profit to stay on screen if levels enabled
    if (showLevels) {
      const { stopLoss, takeProfit3 } = stock.signal.riskManagement;
      if (stopLoss > 0) min = Math.min(min, stopLoss * 0.98);
      if (takeProfit3 > 0) max = Math.max(max, takeProfit3 * 1.02);
    }

    return { minPrice: min, maxPrice: max, maxVolume: vol };
  }, [visibleCandles, showLevels, stock]);

  // Map values to coordinates
  const paddingRight = 65;
  const paddingBottom = 40;
  const paddingTop = 20;
  const paddingLeft = 15;

  const chartWidth = dimensions.width - paddingLeft - paddingRight;
  const chartHeight = dimensions.height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (visibleCandles.length <= 1) return paddingLeft;
    return paddingLeft + (index / (visibleCandles.length - 1)) * chartWidth;
  };

  const getY = (price: number) => {
    if (maxPrice === minPrice) return chartHeight / 2 + paddingTop;
    return chartHeight + paddingTop - ((price - minPrice) / (maxPrice - minPrice)) * chartHeight;
  };

  const getVolY = (vol: number) => {
    const volHeight = chartHeight * 0.18; // bottom 18% of chart
    if (maxVolume === 0) return chartHeight + paddingTop;
    return chartHeight + paddingTop - (vol / maxVolume) * volHeight;
  };

  // Build line paths for EMAs (using simulation overlay matching the trend lines)
  const ema20Path = useMemo(() => {
    if (!showEMAs || visibleCandles.length === 0) return '';
    const points = visibleCandles.map((c, i) => {
      // Simulate EMA line moving smoothly
      const emaVal = c.close * 0.992 + (stock.indicators.ema20 - c.close) * 0.05;
      return `${getX(i)},${getY(emaVal)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [visibleCandles, showEMAs, stock.indicators.ema20, minPrice, maxPrice, dimensions]);

  const ema50Path = useMemo(() => {
    if (!showEMAs || visibleCandles.length === 0) return '';
    const points = visibleCandles.map((c, i) => {
      const emaVal = c.close * 0.985 + (stock.indicators.ema50 - c.close) * 0.08;
      return `${getX(i)},${getY(emaVal)}`;
    });
    return `M ${points.join(' L ')}`;
  }, [visibleCandles, showEMAs, stock.indicators.ema50, minPrice, maxPrice, dimensions]);

  // Handle pointer hover interactions
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current || visibleCandles.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - paddingLeft;
    const percentage = x / chartWidth;
    let index = Math.round(percentage * (visibleCandles.length - 1));
    index = Math.max(0, Math.min(visibleCandles.length - 1, index));
    
    setHoverIndex(index);
    setHoveredCandle(visibleCandles[index]);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setHoveredCandle(null);
  };

  const activeCandle = hoveredCandle || visibleCandles[visibleCandles.length - 1];

  return (
    <div id="price-chart-container" className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl p-4 md:p-5 shadow-2xl backdrop-blur-md">
      {/* Chart Header Bar */}
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <TrendingUp size={18} id="icon-trending" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-slate-100 uppercase" id="ticker-heading">
              {symbol} Real-Time Candlestick Chart
            </h3>
            <p className="text-xs text-slate-400">
              Interval: 5m | Live updates active
            </p>
          </div>
        </div>

        {/* Visibility Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowEMAs(!showEMAs)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showEMAs ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-800'
            }`}
            id="toggle-ema-btn"
          >
            {showEMAs ? <Eye size={12} /> : <EyeOff size={12} />}
            EMAs
          </button>
          <button
            onClick={() => setShowSMC(!showSMC)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showSMC ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-800'
            }`}
            id="toggle-smc-btn"
          >
            {showSMC ? <Eye size={12} /> : <EyeOff size={12} />}
            Smart Money Zones
          </button>
          <button
            onClick={() => setShowLevels(!showLevels)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showLevels ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30' : 'bg-slate-800/40 text-slate-400 border border-slate-800'
            }`}
            id="toggle-levels-btn"
          >
            {showLevels ? <Eye size={12} /> : <EyeOff size={12} />}
            SL/TP Targets
          </button>
        </div>
      </div>

      {/* Hover Info bar */}
      {activeCandle && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-slate-950/60 border border-slate-800/60 rounded-xl p-3 mb-4 text-xs font-mono shadow-inner" dir="ltr">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Open</span>
            <span className="text-slate-200 font-medium">${activeCandle.open.toFixed(decimals)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">High</span>
            <span className="text-emerald-400 font-medium">${activeCandle.high.toFixed(decimals)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Low</span>
            <span className="text-rose-400 font-medium">${activeCandle.low.toFixed(decimals)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 uppercase">Close</span>
            <span className="text-slate-200 font-medium">${activeCandle.close.toFixed(decimals)}</span>
          </div>
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 uppercase">Volume</span>
            <span className="text-indigo-400 font-medium">{activeCandle.volume.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* SVG Container */}
      <div ref={containerRef} className="relative flex-1 min-h-[300px] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800/80">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="select-none cursor-crosshair"
          id="stock-svg-chart"
        >
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => {
            const priceVal = minPrice + (i / 5) * (maxPrice - minPrice);
            const gridY = getY(priceVal);
            return (
              <g key={`grid-y-${i}`} id={`grid-group-${i}`}>
                <line
                  x1={paddingLeft}
                  y1={gridY}
                  x2={dimensions.width - paddingRight}
                  y2={gridY}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={dimensions.width - paddingRight + 6}
                  y={gridY + 4}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${priceVal.toFixed(decimals)}
                </text>
              </g>
            );
          })}

          {/* Time axis grid */}
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = Math.floor((i / 4) * (visibleCandles.length - 1));
            const gridX = getX(idx);
            const candle = visibleCandles[idx];
            if (!candle) return null;
            const timeStr = new Date(candle.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <g key={`grid-x-${i}`} id={`time-grid-group-${i}`}>
                <line
                  x1={gridX}
                  y1={paddingTop}
                  x2={gridX}
                  y2={dimensions.height - paddingBottom}
                  stroke="#1e293b"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={gridX}
                  y={dimensions.height - paddingBottom + 16}
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {timeStr}
                </text>
              </g>
            );
          })}

          {/* Smart Money Concepts: Bullish / Bearish Order Blocks bands */}
          {showSMC && (
            <>
              {/* Bullish Order Blocks (Mitigation Zones) */}
              {stock.smartMoney.bullishOrderBlocks.map((ob, i) => {
                const obY = getY(ob.price);
                return (
                  <g key={`ob-bullish-${i}`} id={`ob-bullish-group-${i}`}>
                    <rect
                      x={paddingLeft}
                      y={obY - 6}
                      width={chartWidth}
                      height={12}
                      fill="rgba(16, 185, 129, 0.05)"
                      stroke="rgba(16, 185, 129, 0.15)"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={paddingLeft + 10}
                      y={obY + 3}
                      fill="#10b981"
                      fontSize="9"
                      fontFamily="monospace"
                      opacity="0.8"
                    >
                      Bullish OB Mitigation (${ob.price})
                    </text>
                  </g>
                );
              })}

              {/* Bearish Order Blocks */}
              {stock.smartMoney.bearishOrderBlocks.map((ob, i) => {
                const obY = getY(ob.price);
                return (
                  <g key={`ob-bearish-${i}`} id={`ob-bearish-group-${i}`}>
                    <rect
                      x={paddingLeft}
                      y={obY - 6}
                      width={chartWidth}
                      height={12}
                      fill="rgba(239, 68, 68, 0.05)"
                      stroke="rgba(239, 68, 68, 0.15)"
                      strokeDasharray="2 2"
                    />
                    <text
                      x={paddingLeft + 10}
                      y={obY + 3}
                      fill="#ef4444"
                      fontSize="9"
                      fontFamily="monospace"
                      opacity="0.8"
                    >
                      Bearish OB Mitigation (${ob.price})
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Risk Management overlay lines */}
          {showLevels && (
            <>
              {/* Stop Loss (SL) */}
              {stock.signal.riskManagement.stopLoss > 0 && (
                <g id="sl-overlay-group">
                  <line
                    x1={paddingLeft}
                    y1={getY(stock.signal.riskManagement.stopLoss)}
                    x2={dimensions.width - paddingRight}
                    y2={getY(stock.signal.riskManagement.stopLoss)}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <rect
                    x={dimensions.width - paddingRight - 45}
                    y={getY(stock.signal.riskManagement.stopLoss) - 9}
                    width={40}
                    height={16}
                    rx={3}
                    fill="#f43f5e"
                  />
                  <text
                    x={dimensions.width - paddingRight - 25}
                    y={getY(stock.signal.riskManagement.stopLoss) + 3}
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    SL
                  </text>
                </g>
              )}

              {/* Take Profits */}
              {[
                { price: stock.signal.riskManagement.takeProfit1, label: 'TP1' },
                { price: stock.signal.riskManagement.takeProfit2, label: 'TP2' },
                { price: stock.signal.riskManagement.takeProfit3, label: 'TP3' }
              ].map((tp, idx) => {
                if (!tp.price) return null;
                const tpY = getY(tp.price);
                return (
                  <g key={`tp-overlay-${idx}`} id={`tp-overlay-${idx}`}>
                    <line
                      x1={paddingLeft}
                      y1={tpY}
                      x2={dimensions.width - paddingRight}
                      y2={tpY}
                      stroke="#10b981"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    <rect
                      x={dimensions.width - paddingRight - 45}
                      y={tpY - 9}
                      width={40}
                      height={16}
                      rx={3}
                      fill="#10b981"
                    />
                    <text
                      x={dimensions.width - paddingRight - 25}
                      y={tpY + 3}
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {tp.label}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {/* Volume bars inside chart bottom */}
          {visibleCandles.map((c, i) => {
            const candleWidth = (chartWidth / visibleCandles.length) * 0.7;
            const x = getX(i) - candleWidth / 2;
            const y = getVolY(c.volume);
            const height = chartHeight + paddingTop - y;
            const color = c.close >= c.open ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)';
            return (
              <rect
                key={`vol-${i}`}
                id={`vol-bar-${i}`}
                x={x}
                y={y}
                width={candleWidth}
                height={Math.max(2, height)}
                fill={color}
              />
            );
          })}

          {/* Candlesticks (Wicks and Bodies) */}
          {visibleCandles.map((c, i) => {
            const isBullish = c.close >= c.open;
            const bodyColor = isBullish ? '#10b981' : '#f43f5e';
            const wickColor = isBullish ? '#34d399' : '#fb7185';
            
            const candleWidth = (chartWidth / visibleCandles.length) * 0.6;
            const x = getX(i) - candleWidth / 2;
            const bodyY = getY(Math.max(c.open, c.close));
            const bodyH = Math.max(1.5, Math.abs(getY(c.open) - getY(c.close)));
            const wickX = getX(i);
            const highY = getY(c.high);
            const lowY = getY(c.low);

            return (
              <g key={`candle-${i}`} id={`candle-group-${i}`}>
                {/* Wick */}
                <line
                  x1={wickX}
                  y1={highY}
                  x2={wickX}
                  y2={lowY}
                  stroke={wickColor}
                  strokeWidth="1.2"
                />
                {/* Real Body */}
                <rect
                  x={x}
                  y={bodyY}
                  width={candleWidth}
                  height={bodyH}
                  fill={bodyColor}
                  stroke={bodyColor}
                  rx="1"
                />
              </g>
            );
          })}

          {/* EMA Curves overlay */}
          {showEMAs && (
            <>
              <path
                d={ema20Path}
                fill="none"
                stroke="#6366f1"
                strokeWidth="1.5"
                opacity="0.9"
                id="ema20-path"
              />
              <path
                d={ema50Path}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.5"
                opacity="0.9"
                id="ema50-path"
              />
            </>
          )}

          {/* Interactive crosshair lines on hover */}
          {hoverIndex !== null && hoveredCandle && (
            <g id="crosshair-lines">
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={paddingTop}
                x2={getX(hoverIndex)}
                y2={dimensions.height - paddingBottom}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              {/* Horizontal line */}
              <line
                x1={paddingLeft}
                y1={getY(hoveredCandle.close)}
                x2={dimensions.width - paddingRight}
                y2={getY(hoveredCandle.close)}
                stroke="#475569"
                strokeWidth="0.8"
                strokeDasharray="3 3"
              />
              {/* Hover dot */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(hoveredCandle.close)}
                r="4"
                fill="#38bdf8"
                stroke="#0f172a"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>
      </div>

      {/* Chart Legend Footer */}
      <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-emerald-500 rounded" />
          <span>Bullish Candle</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-rose-500 rounded" />
          <span>Bearish Candle</span>
        </div>
        {showEMAs && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500" />
              <span>EMA 20 (${stock.indicators.ema20})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500" />
              <span>EMA 50 (${stock.indicators.ema50})</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
