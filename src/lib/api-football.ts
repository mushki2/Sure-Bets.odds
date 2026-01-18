export interface Prediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  date: string;
  prob1: number;
  probX: number;
  prob2: number;
  predictedScore: string;
  over25Prob: number;
  bttsProb: number;
  advice: string;
}

export const getMockPredictions = (): Prediction[] => {
  return [
    {
      matchId: 'p1',
      homeTeam: 'Arsenal',
      awayTeam: 'Brighton',
      league: 'Premier League',
      date: new Date().toISOString(),
      prob1: 65,
      probX: 20,
      prob2: 15,
      predictedScore: '2-0',
      over25Prob: 55,
      bttsProb: 45,
      advice: 'Home Win',
    },
    {
      matchId: 'p2',
      homeTeam: 'Real Madrid',
      awayTeam: 'Barcelona',
      league: 'La Liga',
      date: new Date().toISOString(),
      prob1: 40,
      probX: 25,
      prob2: 35,
      predictedScore: '2-2',
      over25Prob: 75,
      bttsProb: 80,
      advice: 'Over 2.5 Goals',
    }
  ];
};

export const getMockLivescores = () => {
  return [
    {
      id: 'l1',
      homeTeam: 'Man United',
      awayTeam: 'Liverpool',
      score: '1-1',
      status: 'Live',
      minute: '65',
    },
    {
      id: 'l2',
      homeTeam: 'Bayern Munich',
      awayTeam: 'Dortmund',
      score: '3-0',
      status: 'FT',
      minute: '90',
    }
  ];
};
