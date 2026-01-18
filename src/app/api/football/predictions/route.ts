import { NextResponse } from 'next/server';
import { getMockPredictions } from '@/lib/api-football';

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;
  const host = process.env.API_FOOTBALL_HOST;

  if (!apiKey || apiKey === 'your_api_football_key') {
    return NextResponse.json(getMockPredictions());
  }

  try {
    return NextResponse.json(getMockPredictions());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}
