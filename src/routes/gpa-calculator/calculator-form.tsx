import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Course, calculateGpa, letterGrades } from "@/routes/gpa-calculator/calculator";
import { cn } from "@/utils/style";
import { useForm } from "@tanstack/react-form";

type CalculatorForm = {
  courses: Course[];
};

export function Calculator() {
  const form = useForm<CalculatorForm>({
    defaultValues: {
      courses: [],
    },
  });
  const courses = form.useStore((state) => state.values.courses);
  const grades = courses.map((c) => c.grade).flatMap((f) => (!!f ? [f] : []));
  const gpa = calculateGpa(grades).toFixed(2);

  return (
    <div>
      <form.Field name="courses" mode="array">
        {(field) => (
          <>
            <div className="space-y-4">
              {field.state.value.map((_, i) => {
                return (
                  <div key={i} className="flex items-center gap-5">
                    <form.Field name={`courses[${i}].name`}>
                      {(subField) => {
                        return (
                          <div className="flex-1">
                            <Input
                              value={subField.state.value}
                              onChange={(e) => subField.handleChange(e.target.value)}
                              placeholder="Course"
                            />
                          </div>
                        );
                      }}
                    </form.Field>

                    <form.Field name={`courses[${i}].grade`}>
                      {(subField) => {
                        return (
                          <div className="flex items-center gap-2">
                            <div className="w-[8rem] md:w-[16rem] lg:w-[20rem] whitespace-nowrap overflow-scroll">
                              {letterGrades.map((letterGrade) => {
                                const isSelected = subField.state.value === letterGrade;
                                return (
                                  <Button
                                    key={letterGrade}
                                    onClick={() => subField.handleChange(isSelected ? null : letterGrade)}
                                    variant={isSelected ? "secondary" : "ghost"}
                                  >
                                    {letterGrade}
                                  </Button>
                                );
                              })}
                            </div>
                            <div
                              className={cn("size-2 rounded-full", { "bg-yellow-400": !subField.state.value })}
                            ></div>
                            <Button onClick={() => field.removeValue(i)} variant={"secondary"} size={"sm"}>
                              -
                            </Button>
                          </div>
                        );
                      }}
                    </form.Field>
                  </div>
                );
              })}
            </div>
            <Button
              onClick={() => field.pushValue({ name: "", grade: null })}
              variant={"secondary"}
              className={cn({ "mt-6": field.state.value.length > 0 })}
            >
              Add course
            </Button>
          </>
        )}
      </form.Field>

      <div className="mt-6 text-5xl font-black tabular-nums">{gpa}</div>
    </div>
  );
}
