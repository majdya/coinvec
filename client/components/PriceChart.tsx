'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const COINS = [
  { id: 'bitcoin', name: 'Bitcoin', color: '#f7931a' },
  { id: 'ethereum', name: 'Ethereum', color: '#627eea' },
  { id: 'solana', name: 'Solana', color: '#00ffa3' },
];

interface PriceChartProps {
  charts: Record<string, [number, number][]> | null;
  loading: boolean;
  error: string | null;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function formatPrice(price: number): string {
  if (price < 1) return price.toFixed(4);
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PriceChart({ charts, loading, error }: PriceChartProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-semibold mb-3">Price History</h2>
        <p className="text-sm text-red-500">Failed to load chart data.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="font-semibold mb-3">Price History (7d)</h2>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-48 w-full bg-zinc-200 rounded-lg dark:bg-zinc-700" />
        </div>
      ) : !charts ? (
        <p className="text-sm text-zinc-500">No chart data available.</p>
      ) : (
        <div className="space-y-6">
          {COINS.map((coin) => {
            const data = charts[coin.id]?.map(([ts, price]) => ({
              time: formatTime(ts),
              price,
            })) ?? [];

            if (data.length === 0) return null;

            const startPrice = data[0].price;
            const endPrice = data[data.length - 1].price;
            const change = ((endPrice - startPrice) / startPrice) * 100;

            return (
              <div key={coin.id}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: coin.color }} />
                    <span className="text-sm font-medium">{coin.name}</span>
                  </div>
                  <span className={`text-xs font-medium ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {change >= 0 ? '\u25B2' : '\u25BC'} {Math.abs(change).toFixed(1)}%
                  </span>
                </div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={data}>
                    <XAxis dataKey="time" hide />
                    <YAxis domain={['auto', 'auto']} hide />
                    <Tooltip
                      formatter={(value) => [`$${formatPrice(Number(value))}`, coin.name]}
                      labelStyle={{ display: 'none' }}
                      contentStyle={{
                        background: 'var(--background, #fff)',
                        border: '1px solid #e4e4e7',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke={coin.color}
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
