'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MatchOdds } from '@/lib/odds-api';

export default function OddsPage() {
  const [matches, setMatches] = useState<MatchOdds[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/odds')
      .then(res => res.json())
      .then(data => {
        setMatches(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-blue-900 font-medium">Fetching the latest odds...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-blue-900">Live Football Odds</h1>
      <div className="grid gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="border-t-2 border-t-blue-600 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row justify-between items-center bg-gray-50/50 py-3">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{match.home_team}</span>
                <span className="text-gray-400 text-xs font-normal">VS</span>
                <span className="font-bold text-gray-900">{match.away_team}</span>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {new Date(match.commence_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </Badge>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-100">
                      <th className="text-left pb-2 font-semibold">Bookmaker</th>
                      <th className="text-center pb-2 font-semibold w-24">1 (Home)</th>
                      <th className="text-center pb-2 font-semibold w-24">X (Draw)</th>
                      <th className="text-center pb-2 font-semibold w-24">2 (Away)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {match.odds.map((odd, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/20">
                        <td className="py-3 font-medium text-blue-900">{odd.bookmaker}</td>
                        <td className="py-3 text-center">
                          <div className="bg-blue-50 text-blue-700 py-1.5 rounded font-black border border-blue-100">
                            {odd.h2h.home.toFixed(2)}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="bg-gray-50 text-gray-700 py-1.5 rounded font-black border border-gray-100">
                            {odd.h2h.draw ? odd.h2h.draw.toFixed(2) : '-'}
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="bg-blue-50 text-blue-700 py-1.5 rounded font-black border border-blue-100">
                            {odd.h2h.away.toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
