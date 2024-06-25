import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Semester,
  calculateCumGpa,
  calculateGpa,
  letterGrades,
  numCredits,
  numCreditsSemesters,
} from "@/routes/gpa-calculator/calculator";
import { useEffect } from "react";
import { Controller, UseControllerProps, UseFormRegister, UseFormWatch, useFieldArray, useForm } from "react-hook-form";
import { FaShareAlt } from "react-icons/fa";

type Props = {
  initialSemesters: Semester[];
  onChange: (semesters: Semester[]) => void;
  onDelete: () => void;
  onShare: () => void;
};

type CalculatorForm = {
  semesters: Semester[];
};

export function Calculator({ initialSemesters, onChange, onDelete, onShare }: Props) {
  const form = useForm<CalculatorForm>({
    defaultValues: { semesters: initialSemesters },
  });
  const semestersField = useFieldArray({ control: form.control, name: "semesters" });

  const semesters = form.watch("semesters");
  const numSemesters = semesters.length;
  const gpa = calculateCumGpa(semesters).toFixed(2);

  const credits = numCreditsSemesters(semesters);

  useEffect(() => {
    onChange(form.watch("semesters"));
  }, [form.watch()]);

  return (
    <div>
      <div className="sticky top-0 p-5 border-b mb-f flex items-center justify-between bg-white/80">
        <div>
          {numSemesters} semesters, {credits} credits
        </div>

        <div className="flex items-center gap-2">
          <div>
            <span className="font-black">{gpa}</span>/4
          </div>
          <Button onClick={onShare} variant={"secondary"} size={"icon"}>
            <FaShareAlt />
          </Button>
        </div>
      </div>
      <div className="p-5">
        <div className="space-y-6">
          {semestersField.fields.map((_semesterField, i) => {
            const semesterArrayPrefix = `semesters.${i}` as const;
            return (
              <div key={i} className="border rounded-xl p-5">
                <div className="flex items-end gap-2">
                  <Input
                    {...form.register(`${semesterArrayPrefix}.name`)}
                    underline
                    placeholder="Semester name"
                    className="text-lg"
                  />
                  <button onClick={() => semestersField.remove(i)} className="underline">
                    remove
                  </button>
                </div>

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
                courses: [
                  { name: "", grade: "B", credits: 4 },
                  { name: "", grade: "B", credits: 4 },
                ],
              })
            }
            variant={"secondary"}
          >
            Add semester
          </Button>

          <div className="bg-gray-100 p-5 rounded-xl tabular-nums font-black text-2xl flex items-center justify-between">
            <div>
              <span className="text-gray-400">
                {numSemesters} semesters, {credits} credits
              </span>
            </div>
            <div>
              {gpa}
              <span className="text-gray-400">/4</span>
            </div>
          </div>
        </div>
        <button className="mt-6 underline" onClick={onDelete}>
          Delete
        </button>
      </div>
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
  const gpa = calculateGpa(courses).toFixed(2);

  const credits = numCredits(courses);

  return (
    <div className="space-y-4">
      {coursesField.fields.map((_field, i) => {
        return (
          <div key={i}>
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
              <div className="flex-1 flex items-center gap-2">
                <Input {...register(`semesters.${nestIndex}.courses.${i}.name`)} placeholder="Course name" underline />
                <Controller
                  control={control}
                  name={`semesters.${nestIndex}.courses.${i}.credits`}
                  render={({ field }) => {
                    return (
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.currentTarget.valueAsNumber ?? 0)}
                        type="number"
                        placeholder="Credits"
                        className="w-[5rem]"
                        underline
                      />
                    );
                  }}
                />
                <Controller
                  control={control}
                  name={`semesters.${nestIndex}.courses.${i}.grade`}
                  render={({ field }) => {
                    return (
                      <Select value={field.value ?? undefined} onValueChange={field.onChange}>
                        <SelectTrigger className="w-[5rem]">
                          <SelectValue placeholder="Grade" />
                        </SelectTrigger>
                        <SelectContent>
                          {letterGrades.map((grade) => (
                            <SelectItem value={grade}>{grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            coursesField.append({
              name: "",
              grade: "B",
              credits: 4,
            })
          }
          className="underline"
        >
          Add course
        </button>
        <div className="text-2xl font-bold tabular-nums">
          <span className="text-gray-400">{credits} credits</span> {gpa}
          <span className="text-gray-400">/4</span>
        </div>
      </div>
    </div>
  );
}
