import rawAirports from './india-airports.json';

export interface Airport {
  iata: string;
  name: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
  address: string;
  phone: string;
  hours: string;
}

const airports: Airport[] = rawAirports as Airport[];

export type SearchGroup = {
  label: string;
  items: Airport[];
};

export function searchAirports(query: string): SearchGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches = airports.filter((a) =>
    a.iata.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.state.toLowerCase().includes(q)
  ).slice(0, 12);

  if (matches.length === 0) return [];

  const iataMatches = matches.filter((a) => a.iata.toLowerCase() === q);
  const cityMatches = matches.filter(
    (a) => a.city.toLowerCase().includes(q) && !iataMatches.includes(a)
  );
  const others = matches.filter(
    (a) => !iataMatches.includes(a) && !cityMatches.includes(a)
  );

  const groups: SearchGroup[] = [];
  if (iataMatches.length) groups.push({ label: 'Airports', items: iataMatches });
  if (cityMatches.length) groups.push({ label: 'Cities', items: cityMatches });
  if (others.length) groups.push({ label: 'Other Results', items: others });

  return groups;
}

export function getAirportByIata(iata: string): Airport | undefined {
  return airports.find((a) => a.iata === iata);
}

export function getTopAirports(): Airport[] {
  const topIata = ['MAA','BLR','HYD','COK','TRV','IXM','TRZ','BOM','DEL','CCU'];
  return topIata.map((c) => airports.find((a) => a.iata === c)).filter(Boolean) as Airport[];
}
