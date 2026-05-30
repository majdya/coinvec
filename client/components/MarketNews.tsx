'use client';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  data: {
    price: number;
    price_change_percentage_24h: { usd: number };
  };
}

interface MarketNewsProps {
  news: TrendingCoin[];
  loading: boolean;
  error: string | null;
}

function formatPrice(price: number): string {
  if (price < 0.01) return price.toFixed(8);
  if (price < 1) return price.toFixed(4);
  return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function MarketNews({ news, loading, error }: MarketNewsProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-semibold mb-3">Trending Coins</h2>
        <p className="text-sm text-red-500">Failed to load trending coins.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="font-semibold mb-3">Trending Coins</h2>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-3">
              <div className="h-8 w-8 bg-zinc-200 rounded-full dark:bg-zinc-700" />
              <div className="flex-1 space-y-1">
                <div className="h-4 w-24 bg-zinc-200 rounded dark:bg-zinc-700" />
                <div className="h-3 w-16 bg-zinc-200 rounded dark:bg-zinc-700" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-20 bg-zinc-200 rounded dark:bg-zinc-700" />
                <div className="h-3 w-12 bg-zinc-200 rounded dark:bg-zinc-700 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <p className="text-sm text-zinc-500">No trending coins available.</p>
      ) : (
        <div className="space-y-3">
          {news.map((coin) => {
            const change = coin.data?.price_change_percentage_24h?.usd;
            const isPositive = change != null && change >= 0;
            return (
              <div key={coin.id} className="flex items-center gap-3">
                <img
                  src={coin.thumb}
                  alt={coin.name}
                  className="h-8 w-8 rounded-full"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{coin.name}</p>
                  <p className="text-xs text-zinc-500">{coin.symbol} &middot; Rank #{coin.market_cap_rank}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold">
                    ${formatPrice(coin.data?.price ?? 0)}
                  </p>
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
      )}
    </div>
  );
}
