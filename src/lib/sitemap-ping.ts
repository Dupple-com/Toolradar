const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toolradar.com";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

interface PingResult {
  engine: string;
  success: boolean;
  status?: number;
  message?: string;
}

export async function pingSitemapToSearchEngines(): Promise<PingResult[]> {
  const results: PingResult[] = [];

  // Google - ping endpoint (deprecated but still works)
  try {
    const googleUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const googleResponse = await fetch(googleUrl);
    results.push({
      engine: "Google",
      success: googleResponse.ok,
      status: googleResponse.status,
    });
  } catch (error) {
    results.push({
      engine: "Google",
      success: false,
      message: String(error),
    });
  }

  // Bing - sitemap submission via IndexNow is preferred, but we can also ping
  try {
    const bingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const bingResponse = await fetch(bingUrl);
    results.push({
      engine: "Bing",
      success: bingResponse.ok,
      status: bingResponse.status,
    });
  } catch (error) {
    results.push({
      engine: "Bing",
      success: false,
      message: String(error),
    });
  }

  // Yandex
  try {
    const yandexUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`;
    const yandexResponse = await fetch(yandexUrl);
    results.push({
      engine: "Yandex",
      success: yandexResponse.ok || yandexResponse.status === 302,
      status: yandexResponse.status,
    });
  } catch (error) {
    results.push({
      engine: "Yandex",
      success: false,
      message: String(error),
    });
  }

  return results;
}
