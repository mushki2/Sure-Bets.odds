// src/lib/poisson.ts

export const calculatePoisson = (lambda: number, k: number): number => {
  const factorial = (n: number): number => {
    if (n === 0) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };
  return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
};

export const getMatchProbabilities = (homeExpGoals: number, awayExpGoals: number) => {
  const maxGoals = 8;
  const matrix: number[][] = Array(maxGoals).fill(0).map(() => Array(maxGoals).fill(0));

  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  for (let h = 0; h < maxGoals; h++) {
    for (let a = 0; a < maxGoals; a++) {
      const prob = calculatePoisson(homeExpGoals, h) * calculatePoisson(awayExpGoals, a);
      matrix[h][a] = prob;
      if (h > a) homeWinProb += prob;
      else if (h === a) drawProb += prob;
      else awayWinProb += prob;
    }
  }

  // Normalize
  const total = homeWinProb + drawProb + awayWinProb;

  return {
    homeWin: (homeWinProb / total) * 100,
    draw: (drawProb / total) * 100,
    awayWin: (awayWinProb / total) * 100,
    over25: 100 - (matrix[0][0] + matrix[0][1] + matrix[0][2] + matrix[1][0] + matrix[1][1] + matrix[2][0]) / total * 100,
    matrix
  };
};
