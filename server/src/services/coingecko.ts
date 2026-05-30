const BASE = "https://api.coingecko.com/api/v3";

function coinGeckoFetch(url: string): Promise<Response> {
  return fetch(url, {
    headers: process.env.COIN_GECKO_API_KEY
      ? { "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY }
      : undefined,
  });
}

export interface PricesData {
  bitcoin: { usd: number; usd_24h_change: number } | null;
  ethereum: { usd: number; usd_24h_change: number } | null;
  solana: { usd: number; usd_24h_change: number } | null;
}

export async function getPrices(): Promise<PricesData> {
  try {
    const url = `${BASE}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`;
    const res = await coinGeckoFetch(url);
    if (!res.ok) return { bitcoin: null, ethereum: null, solana: null };
    return await res.json();
  } catch {
    return { bitcoin: null, ethereum: null, solana: null };
  }
}

export interface TrendingCoin {
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

export type ChartData = [number, number][];

export async function getMarketChart(coinId: string, days = 7): Promise<ChartData> {
  try {
    const res = await coinGeckoFetch(`${BASE}/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`);
    if (!res.ok) return [];
    const json: { prices: ChartData } = await res.json();
    return json.prices || [];
  } catch {
    return [];
  }
}

export interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  price?: number;
  usd_24h_change?: number;
}

export async function searchCoins(query: string): Promise<SearchResult[]> {
  try {
    const res = await coinGeckoFetch(`${BASE}/search?query=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const json: { coins: SearchResult[] } = await res.json();
    const coins = (json.coins || []).slice(0, 5);
    if (coins.length === 0) return [];

    const ids = coins.map((c) => c.id).join(",");
    const priceRes = await coinGeckoFetch(`${BASE}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
    if (priceRes.ok) {
      const priceData: Record<string, { usd: number; usd_24h_change: number }> = await priceRes.json();
      return coins.map((c) => ({
        ...c,
        price: priceData[c.id]?.usd,
        usd_24h_change: priceData[c.id]?.usd_24h_change,
      }));
    }
    return coins;
  } catch {
    return [];
  }
}

export async function getTrending(): Promise<TrendingCoin[]> {
  try {
    const res = await coinGeckoFetch(`${BASE}/search/trending`);
    if (!res.ok) return [];
    const json: { coins: { item: TrendingCoin }[] } = await res.json();
    return (json.coins || []).map((c) => c.item);
  } catch {
    return [];
  }
}
