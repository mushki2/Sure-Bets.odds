'use client';

import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getMatchProbabilities } from '@/lib/poisson';

export default function CustomPredictionsPage() {
  const [data, setData] = useState<any[]>([]);
  const [teams, setTeams] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    fetch('/data/sample-epl.csv')
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        setData(parsed.data);
        const uniqueTeams = Array.from(new Set(parsed.data.flatMap((row: any) => [row.HomeTeam, row.AwayTeam]))).filter(Boolean) as string[];
        setTeams(uniqueTeams.sort());
      });
  }, []);

  const calculateStrengths = (teamName: string) => {
    const homeGames = data.filter(g => g.HomeTeam === teamName);
    const awayGames = data.filter(g => g.AwayTeam === teamName);

    const avgHomeScored = data.reduce((acc, g) => acc + Number(g.FTHG), 0) / data.length;
    const avgAwayScored = data.reduce((acc, g) => acc + Number(g.FTAG), 0) / data.length;

    const teamHomeScored = homeGames.reduce((acc, g) => acc + Number(g.FTHG), 0) / homeGames.length || 0;
    const teamHomeConceded = homeGames.reduce((acc, g) => acc + Number(g.FTAG), 0) / homeGames.length || 0;

    const teamAwayScored = awayGames.reduce((acc, g) => acc + Number(g.FTAG), 0) / awayGames.length || 0;
    const teamAwayConceded = awayGames.reduce((acc, g) => acc + Number(g.FTHG), 0) / awayGames.length || 0;

    return {
      homeAttack: teamHomeScored / avgHomeScored,
      homeDefense: teamHomeConceded / avgAwayScored,
      awayAttack: teamAwayScored / avgAwayScored,
      awayDefense: teamAwayConceded / avgHomeScored
    };
  };

  const handlePredict = () => {
    if (!homeTeam || !awayTeam || homeTeam === awayTeam) return;

    const hStats = calculateStrengths(homeTeam);
    const aStats = calculateStrengths(awayTeam);

    const avgHomeScored = data.reduce((acc, g) => acc + Number(g.FTHG), 0) / data.length;
    const avgAwayScored = data.reduce((acc, g) => acc + Number(g.FTAG), 0) / data.length;

    const expectedHome = hStats.homeAttack * aStats.awayDefense * avgHomeScored;
    const expectedAway = aStats.awayAttack * hStats.homeDefense * avgAwayScored;

    const probs = getMatchProbabilities(expectedHome, expectedAway);
    setPrediction(probs);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Custom Poisson Predictor</h1>

      <Card className="mb-8">
        <CardHeader>
          <h2 className="text-xl font-bold">Select Teams (EPL 23/24 Sample)</h2>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Home Team</label>
            <select
              value={homeTeam}
              onChange={e => setHomeTeam(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Team</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Away Team</label>
            <select
              value={awayTeam}
              onChange={e => setAwayTeam(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">Select Team</option>
              {teams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <Button onClick={handlePredict} disabled={!homeTeam || !awayTeam || homeTeam === awayTeam}>
            Predict Result
          </Button>
        </CardContent>
      </Card>

      {prediction && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-t-4 border-t-blue-600">
            <CardHeader>
              <h3 className="text-lg font-bold">Probabilities</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span>{homeTeam} Win</span>
                <span className="font-bold">{prediction.homeWin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${prediction.homeWin}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Draw</span>
                <span className="font-bold">{prediction.draw.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-gray-400 h-2 rounded-full" style={{ width: `${prediction.draw}%` }}></div>
              </div>

              <div className="flex justify-between items-center">
                <span>Away Team Win</span>
                <span className="font-bold">{prediction.awayWin.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${prediction.awayWin}%` }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-green-600">
            <CardHeader>
              <h3 className="text-lg font-bold">Goals & Stats</h3>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 uppercase mb-1">Over 2.5 Goals</p>
                <p className="text-3xl font-black text-green-600">{prediction.over25.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Most Likely Scorelines</p>
                <div className="space-y-2">
                  {[
                    { s: '1-0', p: prediction.matrix[1][0] },
                    { s: '1-1', p: prediction.matrix[1][1] },
                    { s: '2-1', p: prediction.matrix[2][1] },
                    { s: '0-1', p: prediction.matrix[0][1] },
                    { s: '2-0', p: prediction.matrix[2][0] },
                  ].sort((a, b) => b.p - a.p).slice(0, 3).map(item => (
                    <div key={item.s} className="flex justify-between text-sm">
                      <span className="font-mono">{item.s}</span>
                      <span className="font-bold">{(item.p * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
