export const letterGrades = ["A", "A-", "B+", "B", "B-", "C+", "C", "C-"] as const;
export type LetterGrade = (typeof letterGrades)[number];
export type Course = {
  name: string;
  grade: null | LetterGrade;
  credits: number;
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

export function calculateGpa(courses: Course[]) {
  if (courses.length === 0) return 0;
  const grades: LetterGrade[] = [];
  for (const course of courses) {
    for (let i = 0; i < course.credits; i++) {
      if (course.grade) grades.push(course.grade);
    }
  }
  if (grades.length === 0) return 0;
  return grades.map(getGrade).reduce((sum, currentValue) => sum + currentValue, 0) / grades.length;
}

export function calculateSemesterGpa(semester: Semester) {
  return calculateGpa(semester.courses);
}

export function calculateCumGpa(semesters: Semester[]) {
  return semesters.length == 0
    ? 0
    : semesters.map(calculateSemesterGpa).reduce((sum, currentValue) => sum + currentValue) / semesters.length;
}

export function numCredits(courses: Course[]) {
  console.log(courses.map((c) => c.credits));
  return courses.reduce((sum, currentValue) => sum + (isNaN(currentValue.credits) ? 0 : currentValue.credits), 0);
}

export function numCreditsSemesters(semesters: Semester[]) {
  return semesters.map((s) => numCredits(s.courses)).reduce((sum, currentValue) => sum + currentValue, 0);
}
