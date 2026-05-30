export interface MemeData {
  url: string;
  title: string;
}

export async function getMeme(): Promise<MemeData | null> {
  try {
    const res = await fetch("https://meme-api.com/gimme");
    if (!res.ok) return null;
    const data: { url: string; title: string } = await res.json();
    return { url: data.url, title: data.title };
  } catch {
    return null;
  }
}
