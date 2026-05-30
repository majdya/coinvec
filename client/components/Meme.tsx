'use client';

interface MemeData {
  url: string;
  title: string;
}

interface MemeProps {
  meme: MemeData | null;
  loading: boolean;
  error: string | null;
}

export default function Meme({ meme, loading, error }: MemeProps) {
  if (error) {
    return (
      <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-semibold mb-3">Meme</h2>
        <p className="text-sm text-red-500">Failed to load meme.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <h2 className="font-semibold mb-3">Meme</h2>
      {loading ? (
        <div className="animate-pulse space-y-2">
          <div className="h-48 w-full bg-zinc-200 rounded-lg dark:bg-zinc-700" />
          <div className="h-4 w-3/4 bg-zinc-200 rounded dark:bg-zinc-700 mx-auto" />
        </div>
      ) : !meme ? (
        <p className="text-sm text-zinc-500">No meme available.</p>
      ) : (
        <div>
          <img
            src={meme.url}
            alt={meme.title}
            className="w-full max-w-md mx-auto rounded-lg object-cover max-h-72"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <p className="text-sm text-center mt-2 text-zinc-600 dark:text-zinc-400">{meme.title}</p>
        </div>
      )}
    </div>
  );
}
