'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Percent, Target, Zap } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: "Football Predictions",
      desc: "Forebet-style 1X2 probabilities, score predictions, and Over/Under tips.",
      icon: <Target className="text-blue-600" />,
      link: "/predictions",
      color: "bg-blue-50"
    },
    {
      title: "Arbitrage Scanner",
      desc: "Instant detection of 2-way and 3-way sure bets across bookmakers.",
      icon: <Percent className="text-green-600" />,
      link: "/arbitrage",
      color: "bg-green-50"
    },
    {
      title: "Value Bets",
      desc: "Identify bets where bookmaker odds are higher than statistical probability.",
      icon: <TrendingUp className="text-yellow-600" />,
      link: "/predictions",
      color: "bg-yellow-50"
    },
    {
      title: "Live Scores",
      desc: "Real-time updates and live match statistics from around the world.",
      icon: <Zap className="text-red-600" />,
      link: "/livescore",
      color: "bg-red-50"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-blue-900 mb-4 tracking-tight">
          Smarter Football Betting
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
          Advanced statistical predictions, live odds comparison, and automated arbitrage detection.
          Everything you need for a data-driven betting strategy.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/predictions">
            <Button size="lg" className="px-12 py-7 text-lg font-bold shadow-lg shadow-blue-200">
              Get Predictions
            </Button>
          </Link>
          <Link href="/arbitrage">
            <Button variant="outline" size="lg" className="px-12 py-7 text-lg font-bold border-2">
              Scan for Arbs
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <Link href={f.link} key={i} className="group">
            <Card className="h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-none shadow-sm overflow-hidden transform group-hover:-translate-y-1">
              <div className={`${f.color} p-8 flex justify-center transition-colors group-hover:bg-opacity-80`}>
                {f.icon}
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">{f.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-24 p-12 bg-gradient-to-br from-blue-900 to-blue-800 rounded-[3rem] text-white text-center shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black mb-4">Custom Analysis Tool</h2>
          <p className="text-blue-100 mb-10 max-w-xl mx-auto text-lg font-medium">
            Upload your own historical data in CSV format and use our Poisson Distribution model
            to generate custom predictions for any league in the world.
          </p>
          <Link href="/custom">
            <Button variant="secondary" size="lg" className="bg-white text-blue-900 hover:bg-blue-50 border-none font-black px-10 py-6 text-lg tracking-tight">
              Try Custom Predictor
            </Button>
          </Link>
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-full translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-12">
        <div>
          <div className="text-4xl font-black text-blue-900 mb-2">99%</div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Data Accuracy</p>
        </div>
        <div>
          <div className="text-4xl font-black text-blue-900 mb-2">24/7</div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Live Odds Tracking</p>
        </div>
        <div>
          <div className="text-4xl font-black text-blue-900 mb-2">15+</div>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Global Leagues</p>
        </div>
      </div>
    </div>
  );
}
