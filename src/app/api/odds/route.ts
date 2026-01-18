import { NextResponse } from 'next/server';
import { getMockOdds } from '@/lib/odds-api';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET() {
  const apiKey = process.env.ODDS_API_KEY;

  if (!apiKey || apiKey === 'your_odds_api_key') {
    return NextResponse.json(getMockOdds());
  }

  try {
    const response = await fetch(
      `https://api.the-odds-api.com/v4/sports/soccer_epl/odds/?apiKey=${apiKey}&regions=uk,eu,us&markets=h2h`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Odds API');
    }

    const data = await response.json();

    // Transform to MatchOdds format
    const transformed = data.map((item: any) => ({
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

    return NextResponse.json(transformed);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch odds' }, { status: 500 });
  }
}
