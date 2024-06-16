export const letterGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-"] as const;
export type LetterGrade = (typeof letterGrades)[number];
export type Course = {
  name: string;
  grade: null | LetterGrade;
};
export type Semester = {
  name: string;
  courses: Course[];
};

const gradeGpaMapping: Record<LetterGrade, number> = {
  A: 4,
  "A-": 3.667,
  "B+": 3.333,
  B: 3,
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

export function calculateSemesterGpa(semester: Semester) {
  const grades = semester.courses?.map((c) => c.grade).flatMap((f) => (!!f ? [f] : []));
  return calculateGpa(grades);
}

export function calculateCumGpa(semesters: Semester[]) {
  return semesters.length == 0
    ? 0
    : semesters.map(calculateSemesterGpa).reduce((sum, currentValue) => sum + currentValue) / semesters.length;
}
