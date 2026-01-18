'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Prediction } from '@/lib/api-football';
import { Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toggleFavorite } from '@/lib/firebase/firestore';

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [odds, setOdds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Today');
  const { user } = useAuth();

  useEffect(() => {
    Promise.all([
      fetch('/api/football/predictions').then(res => res.json()),
      fetch('/api/odds').then(res => res.json())
    ]).then(([predData, oddsData]) => {
      setPredictions(Array.isArray(predData) ? predData : []);
      setOdds(Array.isArray(oddsData) ? oddsData : []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleFavorite = async (prediction: Prediction) => {
    if (!user) {
      alert('Please login to save favorites');
      return;
    }
    await toggleFavorite(user.uid, {
      id: prediction.matchId,
      type: 'match',
      name: `${prediction.homeTeam} vs ${prediction.awayTeam}`
    });
  };

  const findValue = (p: Prediction) => {
    if (!odds || !Array.isArray(odds)) return null;
    const matchOdd = odds.find(o =>
      o.home_team && (o.home_team.includes(p.homeTeam) || p.homeTeam.includes(o.home_team))
    );
    if (!matchOdd || !matchOdd.odds) return null;

    // Simplified best odds picker
    const bestHome = Math.max(...matchOdd.odds.map((o: any) => o.h2h.home));
    const bestDraw = Math.max(...matchOdd.odds.map((o: any) => o.h2h.draw || 0));
    const bestAway = Math.max(...matchOdd.odds.map((o: any) => o.h2h.away));

    const homeValue = (p.prob1 / 100) * bestHome;
    const drawValue = (p.probX / 100) * bestDraw;
    const awayValue = (p.prob2 / 100) * bestAway;

    if (homeValue > 1.1) return { type: 'Home Win', value: homeValue, odds: bestHome };
    if (drawValue > 1.1) return { type: 'Draw', value: drawValue, odds: bestDraw };
    if (awayValue > 1.1) return { type: 'Away Win', value: awayValue, odds: bestAway };

    return null;
  };

  if (loading) {
    return <div className="p-8 text-center">Loading predictions and odds...</div>;
  }

  const tabs = ['Today', 'Tomorrow', 'Weekend', 'Live', 'All'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Football Predictions</h1>

      <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'primary' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className="whitespace-nowrap"
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="grid gap-6">
        {predictions.map((p) => {
          const value = findValue(p);
          return (
            <Card key={p.matchId} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row justify-between items-center bg-gray-50/50">
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary">{p.league}</Badge>
                  <span className="text-sm text-gray-500">{new Date(p.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {value && (
                    <Badge variant="success" className="flex items-center">
                      <TrendingUp size={12} className="mr-1" />
                      Value Bet: {value.type} @ {value.odds}
                    </Badge>
                  )}
                  <button
                    onClick={() => handleFavorite(p)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </CardHeader>
              <CardContent className="py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                  <div className="flex justify-between items-center space-x-4">
                    <div className="text-right flex-1">
                      <p className="font-bold text-lg">{p.homeTeam}</p>
                    </div>
                    <div className="bg-blue-900 text-white px-3 py-1 rounded font-mono font-bold">
                      {p.predictedScore}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-bold text-lg">{p.awayTeam}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span>1: {p.prob1}%</span>
                      <span>X: {p.probX}%</span>
                      <span>2: {p.prob2}%</span>
                    </div>
                    <div className="h-3 w-full flex rounded-full overflow-hidden bg-gray-100">
                      <div style={{ width: `${p.prob1}%` }} className="bg-green-500"></div>
                      <div style={{ width: `${p.probX}%` }} className="bg-gray-400"></div>
                      <div style={{ width: `${p.prob2}%` }} className="bg-blue-500"></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500 uppercase">O/U 2.5</p>
                      <p className="font-bold text-blue-900">{p.over25Prob}%</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500 uppercase">BTTS</p>
                      <p className="font-bold text-blue-900">{p.bttsProb}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <div className="px-6 py-3 bg-green-50 border-t border-green-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-green-800">Advice: {p.advice}</span>
                <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-800 text-xs">View Stats</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
