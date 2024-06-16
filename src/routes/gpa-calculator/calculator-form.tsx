import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Semester, calculateCumGpa, calculateGpa, letterGrades } from "@/routes/gpa-calculator/calculator";
import { cn } from "@/utils/style";
import {
  UseControllerProps,
  UseFormRegister,
  UseFormWatch,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";

type CalculatorForm = {
  semesters: Semester[];
};

export function Calculator() {
  const form = useForm<CalculatorForm>({
    defaultValues: { semesters: [] },
  });
  const semestersField = useFieldArray({ control: form.control, name: "semesters" });

  const semesters = form.watch("semesters");
  const gpa = calculateCumGpa(semesters).toFixed(2);

  return (
    <div className="space-y-6">
      {semestersField.fields.map((semesterField, i) => {
        const semesterArrayPrefix = `semesters.${i}` as const;
        return (
          <div key={i} className="border p-5">
            <Input
              {...form.register(`${semesterArrayPrefix}.name`)}
              underline
              placeholder="Semester name"
              className="text-lg"
            />

            <div className="mt-4">
              <CoursesListForm control={form.control} nestIndex={i} register={form.register} watch={form.watch} />
            </div>
          </div>
        );
      })}
      <Button
        onClick={() =>
          semestersField.append({
            name: "",
            courses: [],
          })
        }
        variant={"secondary"}
      >
        Add semester
      </Button>

      <div className="mt-6 tabular-nums font-black text-5xl">{gpa}</div>
    </div>
  );
}

function CoursesListForm({
  control,
  nestIndex,
  register,
  watch,
}: {
  control: UseControllerProps<CalculatorForm>["control"];
  nestIndex: number;
  register: UseFormRegister<CalculatorForm>;
  watch: UseFormWatch<CalculatorForm>;
}) {
  const coursesField = useFieldArray({ control, name: `semesters.${nestIndex}.courses` });
  const courses = watch(`semesters.${nestIndex}.courses`);
  const gpa = calculateGpa(courses.map((c) => c.grade).flatMap((f) => (!!f ? [f] : []))).toFixed(2);

  return (
    <div className="space-y-4">
      {coursesField.fields.map((field, i) => {
        return (
          <div key={i}>
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
              <Input {...register(`semesters.${nestIndex}.courses.${i}.name`)} placeholder="Course name" />
              <GradeInput control={control} name={`semesters.${nestIndex}.courses.${i}.grade`} />
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <Button
          onClick={() =>
            coursesField.append({
              name: "",
              grade: null,
            })
          }
          variant={"secondary"}
        >
          Add course
        </Button>
        <div className="text-2xl font-bold tabular-nums">{gpa}</div>
      </div>
    </div>
  );
}

function GradeInput(props: UseControllerProps) {
  const { field } = useController(props);
  return (
    <div className="flex gap-2">
      <div className="md:w-[16rem] lg:w-[20rem] whitespace-nowrap overflow-scroll">
        <div>
          {letterGrades.map((letterGrade) => {
            const isSelected = field.value === letterGrade;
            return (
              <Button
                key={letterGrade}
                onClick={() => field.onChange(isSelected ? null : letterGrade)}
                variant={isSelected ? "secondary" : "ghost"}
              >
                {letterGrade}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <div className={cn("size-2 rounded-full", { "bg-yellow-400": !field.value })}></div>
      </div>
    </div>
  );
}
