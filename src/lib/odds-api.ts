export interface Odd {
  bookmaker: string;
  h2h: {
    home: number;
    away: number;
    draw?: number;
  };
}

export interface MatchOdds {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  odds: Odd[];
}

export interface ArbitrageOpportunity {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  market: 'h2h';
  outcomes: {
    name: string;
    price: number;
    bookmaker: string;
  }[];
  total_implied_probability: number;
  profit_percentage: number;
}

export const calculateArbitrage = (matches: MatchOdds[]): ArbitrageOpportunity[] => {
  const opportunities: ArbitrageOpportunity[] = [];

  matches.forEach((match) => {
    const bestHome = { price: 0, bookmaker: '' };
    const bestAway = { price: 0, bookmaker: '' };
    const bestDraw = { price: 0, bookmaker: '' };

    match.odds.forEach((odd) => {
      if (odd.h2h.home > bestHome.price) {
        bestHome.price = odd.h2h.home;
        bestHome.bookmaker = odd.bookmaker;
      }
      if (odd.h2h.away > bestAway.price) {
        bestAway.price = odd.h2h.away;
        bestAway.bookmaker = odd.bookmaker;
      }
      if (odd.h2h.draw && odd.h2h.draw > bestDraw.price) {
        bestDraw.price = odd.h2h.draw;
        bestDraw.bookmaker = odd.bookmaker;
      }
    });

    if (bestHome.price > 0 && bestAway.price > 0) {
      let totalImpliedProb = (1 / bestHome.price) + (1 / bestAway.price);
      const outcomes = [
        { name: match.home_team, price: bestHome.price, bookmaker: bestHome.bookmaker },
        { name: match.away_team, price: bestAway.price, bookmaker: bestAway.bookmaker },
      ];

      if (bestDraw.price > 0) {
        totalImpliedProb += (1 / bestDraw.price);
        outcomes.push({ name: 'Draw', price: bestDraw.price, bookmaker: bestDraw.bookmaker });
      }

      if (totalImpliedProb < 1) {
        opportunities.push({
          id: match.id,
          home_team: match.home_team,
          away_team: match.away_team,
          commence_time: match.commence_time,
          market: 'h2h',
          outcomes,
          total_implied_probability: totalImpliedProb,
          profit_percentage: (1 / totalImpliedProb - 1) * 100,
        });
      }
    }
  });

  return opportunities.sort((a, b) => b.profit_percentage - a.profit_percentage);
};

// Mock data generator for development
export const getMockOdds = (): MatchOdds[] => {
  return [
    {
      id: 'mock-1',
      home_team: 'Arsenal',
      away_team: 'Manchester City',
      commence_time: new Date().toISOString(),
      odds: [
        { bookmaker: 'Bet365', h2h: { home: 2.5, away: 2.8, draw: 3.4 } },
        { bookmaker: 'William Hill', h2h: { home: 2.6, away: 2.7, draw: 3.3 } },
        { bookmaker: 'Paddy Power', h2h: { home: 2.4, away: 2.9, draw: 3.5 } },
      ]
    },
    {
      id: 'mock-2',
      home_team: 'Liverpool',
      away_team: 'Chelsea',
      commence_time: new Date().toISOString(),
      odds: [
        { bookmaker: 'Bet365', h2h: { home: 1.8, away: 4.5, draw: 3.8 } },
        { bookmaker: 'Unibet', h2h: { home: 1.85, away: 4.2, draw: 4.0 } },
        // Arbitrage opportunity here
        { bookmaker: 'ArbBookie', h2h: { home: 2.1, away: 5.5, draw: 4.5 } },
      ]
    }
  ];
};
