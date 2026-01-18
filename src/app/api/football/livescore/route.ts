import { NextResponse } from 'next/server';
import { getMockLivescores } from '@/lib/api-football';

export const revalidate = 60; // Revalidate every minute

export async function GET() {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey || apiKey === 'your_api_football_key') {
    return NextResponse.json(getMockLivescores());
  }

  try {
    return NextResponse.json(getMockLivescores());
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch livescores' }, { status: 500 });
  }
}
