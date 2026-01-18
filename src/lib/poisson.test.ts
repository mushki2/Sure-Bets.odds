import { calculatePoisson, getMatchProbabilities } from '@/lib/poisson';

describe('Poisson Logic', () => {
  test('calculatePoisson returns correct probability', () => {
    // Lambda = 2, k = 1 => (e^-2 * 2^1) / 1! = 0.135335 * 2 = 0.27067
    const prob = calculatePoisson(2, 1);
    expect(prob).toBeCloseTo(0.27067, 5);
  });

  test('getMatchProbabilities returns normalized percentages', () => {
    const probs = getMatchProbabilities(1.5, 1.2);
    expect(probs.homeWin + probs.draw + probs.awayWin).toBeCloseTo(100, 1);
    expect(probs.homeWin).toBeGreaterThan(0);
    expect(probs.awayWin).toBeGreaterThan(0);
    expect(probs.over25).toBeGreaterThan(0);
  });
});
