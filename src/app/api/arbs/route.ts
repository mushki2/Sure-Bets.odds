import { NextResponse } from 'next/server';
import { getMockOdds, calculateArbitrage } from '@/lib/odds-api';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;
  let matches;

  if (!apiKey || apiKey === 'your_odds_api_key') {
    matches = getMockOdds();
  } else {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`
      );
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      matches = data.map((item: any) => ({
        id: item.id,
        home_team: item.home_team,
        away_team: item.away_team,
        commence_time: item.commence_time,
        odds: item.bookmakers.map((bm: any) => ({
          bookmaker: bm.title,
          h2h: {
            home: bm.markets[0].outcomes.find((o: any) => o.name === item.home_team)?.price,
            away: bm.markets[0].outcomes.find((o: any) => o.name === item.away_team)?.price,
            draw: bm.markets[0].outcomes.find((o: any) => o.name === 'Draw')?.price,
          }
        }))
      }));
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
    }
  }

  const arbs = calculateArbitrage(matches);
  return NextResponse.json(arbs);
}
