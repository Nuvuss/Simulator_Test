export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Returns array of indices [0-4] shuffled
// Questions (0,1,2) shuffled first, then Objections (3,4) shuffled
export function shuffleQuestionOrder(): number[] {
  const questions = shuffleArray([0, 1, 2]);
  const objections = shuffleArray([3, 4]);
  return [...questions, ...objections];
}
