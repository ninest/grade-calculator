import { calculateCumGpa, calculateGpa, numCredits, numCreditsSemesters } from "@/routes/gpa-calculator/calculator";
import { Tab } from "@/routes/gpa-calculator/use-storage";

export function GradeReport({ tab }: { tab: Tab }) {
  const numSemesters = tab.semesters.length;
  const credits = numCreditsSemesters(tab.semesters);
  const gpa = calculateCumGpa(tab.semesters).toFixed(2);

  return (
    <div className="border rounded-lg">
      <div className="p-5 border-b">
        <h1 className="text-3xl font-black">{tab.name}</h1>

        <div className="mt-3 space-y-4">
          {tab.semesters.map((semester, i) => {
            const credits = numCredits(semester.courses);
            const gpa = calculateGpa(semester.courses).toFixed(2);
            return (
              <section key={semester.name + i}>
                <h2 className="font-bold">{semester.name}</h2>
                <div className="mt-1">
                  <ul>
                    {semester.courses.map((course, i) => (
                      <li key={course.name + i} className="w-full flex  justify-between">
                        <div>
                          {course.name} <span className="text-gray-400">{course.credits} credits</span>
                        </div>
                        <div>{course.grade}</div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-1 flex items-center justify-between font-bold">
                    <div>{credits} credits</div>
                    <div>
                      {gpa}
                      <span className="text-gray-500">/4</span>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
      <div className="p-5 flex items-center justify-between text-lg">
        <div>
          {numSemesters} semesters, {credits} credits
        </div>
        <div className="font-black">
          {gpa}
          <span className="text-gray-500">/4</span>
        </div>
      </div>
    </div>
  );
}
