export const letterGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-"] as const;
export type LetterGrade = (typeof letterGrades)[number];
export type Course = {
  name: string;
  grade: null | LetterGrade;
};

const gradeGpaMapping: Record<LetterGrade, number> = {
  A: 4,
  "A-": 3.667,
  "B+": 3.333,
  B: 2,
  "B-": 2.667,
  "C+": 2.333,
  C: 2,
  "C-": 1.667,
};

function getGrade(letterGrade: LetterGrade) {
  return gradeGpaMapping[letterGrade];
}

export function calculateGpa(letterGrades: LetterGrade[]) {
  return letterGrades.length == 0
    ? 0
    : letterGrades.map(getGrade).reduce((sum, currentValue) => sum + currentValue, 0) / letterGrades.length;
}
