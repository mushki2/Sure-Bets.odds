import { NextResponse } from 'next/server';

export const revalidate = 86400; // Revalidate every day

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leagueId = searchParams.get('league') || '39'; // Default EPL

  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey || apiKey === 'your_api_football_key') {
    // Return mock standings
    return NextResponse.json([
      { rank: 1, team: { name: 'Arsenal' }, points: 75, played: 32, goalsDiff: 45 },
      { rank: 2, team: { name: 'Man City' }, points: 73, played: 32, goalsDiff: 40 },
      { rank: 3, team: { name: 'Liverpool' }, points: 71, played: 32, goalsDiff: 38 },
    ]);
  }

  try {
    return NextResponse.json([]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
