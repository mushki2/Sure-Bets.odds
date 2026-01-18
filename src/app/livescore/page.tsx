'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Timer, Radio } from 'lucide-react';

export default function LivescorePage() {
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = () => {
      fetch('/api/football/livescore')
        .then(res => res.json())
        .then(data => {
          setScores(data);
          setLoading(false);
        });
    };

    fetchScores();
    const interval = setInterval(fetchScores, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading live scores...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <Radio className="text-red-500 mr-2 animate-pulse" />
          Live Scores
        </h1>
        <Badge variant="outline" className="flex items-center">
          <Timer size={14} className="mr-1" />
          Auto-refreshing
        </Badge>
      </div>

      <div className="grid gap-3">
        {scores.map((s) => (
          <Card key={s.id} className={s.status === 'Live' ? 'border-l-4 border-l-red-500' : ''}>
            <CardContent className="flex items-center py-4 px-6">
              <div className="w-16 text-sm font-bold text-red-600">
                {s.status === 'Live' ? `${s.minute}'` : s.status}
              </div>
              <div className="flex-grow grid grid-cols-3 items-center">
                <div className="text-right font-bold pr-4">{s.homeTeam}</div>
                <div className="bg-gray-900 text-white py-1 px-4 rounded text-center font-mono text-xl font-bold mx-auto">
                  {s.score}
                </div>
                <div className="text-left font-bold pl-4">{s.awayTeam}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
