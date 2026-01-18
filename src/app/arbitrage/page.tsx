'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArbitrageOpportunity } from '@/lib/odds-api';

export default function ArbitragePage() {
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [stake, setStake] = useState<number>(100);

  useEffect(() => {
    fetch('/api/arbs')
      .then(res => res.json())
      .then(data => {
        setOpportunities(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Scanning for arbitrage opportunities...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Arbitrage Opportunities</h1>
          <p className="text-gray-600">Guaranteed profit by covering all outcomes across different bookmakers.</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Stake ($)</label>
          <input
            type="number"
            value={stake}
            onChange={(e) => setStake(Number(e.target.value))}
            className="border rounded px-3 py-2 w-32 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {opportunities.length === 0 ? (
        <Card className="p-12 text-center text-gray-500">
          No arbitrage opportunities found at the moment. Check back later!
        </Card>
      ) : (
        <div className="grid gap-6">
          {opportunities.map((arb) => (
            <Card key={arb.id} className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{arb.home_team} vs {arb.away_team}</h3>
                  <p className="text-sm text-gray-500">{new Date(arb.commence_time).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant="success" className="text-lg py-1 px-3">
                    {arb.profit_percentage.toFixed(2)}% Profit
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {arb.outcomes.map((outcome, idx) => {
                    const individualStake = (stake / (arb.total_implied_probability * outcome.price));
                    return (
                      <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">{outcome.name}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-xl font-bold text-blue-900">{outcome.price}</p>
                            <p className="text-xs text-gray-600">{outcome.bookmaker}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-green-700">${individualStake.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Stake</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
              <CardFooter className="bg-green-50/50 flex justify-between items-center">
                <span className="text-sm text-green-800 font-medium">
                  Total Return: ${(stake * (1 + arb.profit_percentage / 100)).toFixed(2)}
                </span>
                <span className="text-sm text-green-800 font-bold">
                  Net Profit: ${(stake * (arb.profit_percentage / 100)).toFixed(2)}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <h4 className="font-bold text-blue-900 mb-2">What is Arbitrage Betting?</h4>
        <p className="text-sm text-blue-800 leading-relaxed">
          Arbitrage betting (or "sure betting") occurs when bookmakers have different opinions on the outcome of an event.
          By placing bets on all possible outcomes across different bookmakers, you can guarantee a profit regardless of the result.
          Always double-check odds before placing bets, as they can change rapidly.
        </p>
      </div>
    </div>
  );
}
