'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import CoinPrices from '@/components/CoinPrices';
import MarketNews from '@/components/MarketNews';
import Meme from '@/components/Meme';
import PriceChart from '@/components/PriceChart';

interface DashboardData {
  trending: Parameters<typeof MarketNews>[0]['news'];
  meme: Parameters<typeof Meme>[0]['meme'];
  charts: Record<string, [number, number][]>;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/dashboard');
      setData(res.data);
    } catch {
      setError('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) fetchDashboard();
  }, [user, fetchDashboard]);

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-500">Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 p-6">
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user.name}</h1>
        <p className="mt-1 text-blue-100">Your daily crypto snapshot is ready.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoinPrices error={error} />
        <MarketNews news={data?.trending ?? []} loading={loading} error={error} />
        <Meme meme={data?.meme ?? null} loading={loading} error={error} />
        <PriceChart charts={data?.charts ?? null} loading={loading} error={error} />
      </div>
    </div>
  );
}
