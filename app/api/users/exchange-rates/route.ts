let cachedRates: Record<string, number> | null = null;
let lastFetched = 0;

const CACHE_DURATION = 1000 * 60 * 60 * 6; 

const FALLBACK_RATES: Record<string, number> = {
  NGN: 1,
  USD: 0.00067,
  EUR: 0.00062,
  GBP: 0.00053,
};

export async function GET() {
  const now = Date.now();

  if (cachedRates && now - lastFetched < CACHE_DURATION) {
    return new Response(JSON.stringify(cachedRates), { status: 200 });
  }

  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/NGN");
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    cachedRates = data.rates;
    lastFetched = now;

    return new Response(JSON.stringify(cachedRates), { status: 200 });
  } catch (err) {
    console.error("Exchange rates fetch failed, using fallback.", err);
    cachedRates = FALLBACK_RATES;
    lastFetched = now;
    return new Response(JSON.stringify(FALLBACK_RATES), { status: 200 });
  }
}
