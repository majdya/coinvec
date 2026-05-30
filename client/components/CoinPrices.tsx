'use client';

import { useState, useCallback } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import api from '@/lib/api';

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price?: number;
  usd_24h_change?: number;
}

interface LookedUpCoin extends SearchResult {
  chart: [number, number][];
}

interface CoinPricesProps {
  error: string | null;
}

function formatPrice(usd: number): string {
  return usd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function Sparkline({ data, color }: { data: [number, number][]; color: string }) {
  const chartData = data.map(([ts, price]) => ({ t: ts, p: price }));
  return (
    <ResponsiveContainer width={80} height={32}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="p" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function CoinPrices({ error }: CoinPricesProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [lookedUp, setLookedUp] = useState<LookedUpCoin[]>([]);

  const handleSearch = useCallback(async (q: string) => {
    setQuery(q);
    if (q.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    setSearching(true);
    try {
      const res = await api.get('/api/dashboard/search', { params: { q } });
      setResults(res.data);
      setShowResults(true);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  const addLookedUp = useCallback(async (coin: SearchResult) => {
    setQuery(coin.name);
    setShowResults(false);
    if (lookedUp.some((c) => c.id === coin.id)) return;
    try {
      const res = await api.get(`/api/dashboard/chart/${coin.id}`);
      const chart: [number, number][] = res.data;
      setLookedUp((prev) => [{ ...coin, chart }, ...prev].slice(0, 5));
    } catch {
      setLookedUp((prev) => [{ ...coin, chart: [] }, ...prev].slice(0, 5));
    }
  }, [lookedUp]);

  if (error) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-semibold mb-3">Coin Prices</h2>
        <p className="text-sm text-red-500">Failed to load prices.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="font-semibold mb-3">Coin Prices</h2>

      <div className="relative mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyUp={(e) => {
            const value = (e.target as HTMLInputElement).value;
            if (value.length >= 2 || value.length === 0) handleSearch(value);
          }}
          onFocus={() => results.length > 0 && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          placeholder="Search any coin..."
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        {searching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-600" />
          </div>
        )}
        {showResults && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {results.map((coin) => {
              const isPositive = coin.usd_24h_change != null && coin.usd_24h_change >= 0;
              return (
                <div
                  key={coin.id}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                  onMouseDown={() => addLookedUp(coin)}
                >
                  {coin.thumb && (
                    <img src={coin.thumb} alt="" className="h-6 w-6 rounded-full" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{coin.name}</p>
                    <p className="text-xs text-zinc-500">{coin.symbol} &middot; Rank #{coin.market_cap_rank}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {coin.price != null && (
                      <p className="text-sm font-semibold">${formatPrice(coin.price)}</p>
                    )}
                    {coin.usd_24h_change != null && (
                      <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '\u25B2' : '\u25BC'} {Math.abs(coin.usd_24h_change).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>



      {lookedUp.length > 0 && (
        <div className="border-t border-zinc-200 pt-4 mt-4 dark:border-zinc-800">
          <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Recently Viewed</p>
          <div className="space-y-3">
            {lookedUp.map((coin) => {
              const change = coin.usd_24h_change;
              const isPositive = change != null && change >= 0;
              return (
                <div key={coin.id} className="flex items-center gap-2">
                  {coin.thumb && (
                    <img src={coin.thumb} alt="" className="h-7 w-7 rounded-full shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{coin.name}</p>
                    <p className="text-xs text-zinc-500">{coin.symbol}</p>
                  </div>
                  {coin.chart.length > 0 && (
                    <Sparkline data={coin.chart} color={isPositive ? '#22c55e' : '#ef4444'} />
                  )}
                  <div className="text-right shrink-0 min-w-[80px]">
                    {coin.price != null && (
                      <p className="text-sm font-semibold">${formatPrice(coin.price)}</p>
                    )}
                    {change != null && (
                      <p className={`text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? '\u25B2' : '\u25BC'} {Math.abs(change).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
