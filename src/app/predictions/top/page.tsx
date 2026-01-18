'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Prediction } from '@/lib/api-football';
import { TrendingUp } from 'lucide-react';

export default function TopPredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/football/predictions')
      .then(res => res.json())
      .then(data => {
        // Sort by highest probability for win or draw
        const sorted = [...data].sort((a, b) =>
          Math.max(b.prob1, b.prob2, b.probX) - Math.max(a.prob1, a.prob2, a.probX)
        );
        setPredictions(sorted);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading top tips...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <TrendingUp className="text-green-600" size={32} />
        <h1 className="text-3xl font-bold">Top Confidence Tips</h1>
      </div>

      <div className="grid gap-4">
        {predictions.map((p, idx) => (
          <Card key={p.matchId} className="border-l-4 border-l-blue-600">
            <CardContent className="flex flex-col md:flex-row justify-between items-center py-4">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <span className="text-2xl font-black text-gray-200">#{idx + 1}</span>
                <div>
                  <p className="font-bold">{p.homeTeam} vs {p.awayTeam}</p>
                  <p className="text-xs text-gray-500">{p.league}</p>
                </div>
              </div>

              <div className="flex space-x-8 items-center w-full md:w-auto justify-around">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Confidence</p>
                  <p className="text-xl font-black text-green-600">
                    {Math.max(p.prob1, p.prob2, p.probX)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Outcome</p>
                  <p className="text-md font-bold text-blue-900">{p.advice}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-bold">Score</p>
                  <p className="text-md font-bold text-gray-700">{p.predictedScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
