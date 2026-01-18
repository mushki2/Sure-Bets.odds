'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function StandingsPage() {
  const params = useParams();
  const leagueId = params.leagueId || '39';
  const [standings, setStandings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/football/standings?league=${leagueId}`)
      .then(res => res.json())
      .then(data => {
        setStandings(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [leagueId]);

  if (loading) {
    return <div className="p-12 text-center text-blue-900 font-bold">Loading League Table...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <h1 className="text-4xl font-black text-blue-900 tracking-tight">League Standings</h1>
        <Badge variant="primary" className="text-sm px-4 py-1">2023/24 Season</Badge>
      </div>

      <Card className="border-none shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-900 text-white border-b border-blue-800">
                <tr>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider w-16">Pos</th>
                  <th className="px-6 py-5 text-left font-bold uppercase tracking-wider">Team</th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider">PL</th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider">GD</th>
                  <th className="px-6 py-5 text-center font-bold uppercase tracking-wider">PTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {standings.map((row) => (
                  <tr key={row.rank} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap font-black text-gray-400">{row.rank}</td>
                    <td className="px-6 py-5 whitespace-nowrap font-bold text-blue-900 text-lg">{row.team.name}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center font-medium text-gray-600">{row.played}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-center">
                      <span className={`px-2 py-1 rounded font-bold ${row.goalsDiff > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {row.goalsDiff > 0 ? `+${row.goalsDiff}` : row.goalsDiff}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-center font-black text-2xl text-blue-600">{row.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-6 bg-gray-100 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-500 italic">
          * Standings are updated automatically after every match day. Statistical models use this data to calculate team strengths.
        </p>
      </div>
    </div>
  );
}
