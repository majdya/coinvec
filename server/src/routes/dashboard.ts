import { Router } from "express";
import auth from "../middleware/auth.js";
import { getPrices, getTrending, getMarketChart, searchCoins } from "../services/coingecko.js";
import { getMeme } from "../services/meme.js";

const COINS = ["bitcoin", "ethereum", "solana"];

const router = Router();

router.use(auth);

router.get("/", async (_req, res) => {
  const [pricesResult, trendingResult, memeResult, ...chartResults] = await Promise.allSettled([
    getPrices(),
    getTrending(),
    getMeme(),
    ...COINS.map((id) => getMarketChart(id, 7)),
  ]);

  const charts: Record<string, [number, number][]> = {};
  chartResults.forEach((r, i) => {
    if (r.status === "fulfilled") charts[COINS[i]] = r.value;
  });

  res.json({
    prices: pricesResult.status === "fulfilled" ? pricesResult.value : null,
    trending: trendingResult.status === "fulfilled" ? trendingResult.value : [],
    meme: memeResult.status === "fulfilled" ? memeResult.value : null,
    charts,
  });
});

router.get("/chart/:coinId", async (req, res) => {
  const { coinId } = req.params;
  const data = await getMarketChart(coinId, 7);
  res.json(data);
});

router.get("/search", async (req, res) => {
  const q = req.query.q as string;
  if (!q || q.length < 2) {
    res.json([]);
    return;
  }
  const results = await searchCoins(q);
  res.json(results);
});

export default router;
