import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600 font-semibold mb-2">SureBets Odds</p>
        <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-4">
          Statistical predictions only – gamble responsibly. We provide data-driven insights to help you make informed decisions, but we do not guarantee results.
        </p>
        <div className="flex justify-center space-x-6 text-sm text-blue-600 mb-4">
          <Link href="/predictions" className="hover:underline">Predictions</Link>
          <Link href="/odds" className="hover:underline">Odds</Link>
          <Link href="/arbitrage" className="hover:underline">Arbitrage</Link>
          <Link href="/custom" className="hover:underline">Custom Tools</Link>
        </div>
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} SureBets Odds. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
