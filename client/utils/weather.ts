export type Weather = {
  temperature: number | null;
  humidity: number | null;
  precipitation: number | null;
  name?: string;
};

export async function getWeather(lat: number, lon: number): Promise<Weather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      temperature: data?.current?.temperature_2m ?? null,
      humidity: data?.current?.relative_humidity_2m ?? null,
      precipitation: data?.current?.precipitation ?? null,
    };
  } catch {
    return { temperature: null, humidity: null, precipitation: null };
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<string | undefined> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      { headers: { "User-Agent": "agri-scan-ai-demo" } },
    );
    const data = await res.json();
    return (
      data?.address?.village || data?.address?.hamlet || data?.display_name
    );
  } catch {
    return undefined;
  }
}
