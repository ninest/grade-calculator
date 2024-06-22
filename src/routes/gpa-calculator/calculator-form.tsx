import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaCaretLeft, FaCaretRight, FaChevronLeft, FaChevronRight, FaRegTrashCan } from "react-icons/fa6";
import {
  Semester,
  calculateCumGpa,
  calculateGpa,
  letterGrades,
  numCredits,
  numCreditsSemesters,
} from "@/routes/gpa-calculator/calculator";
import { cn } from "@/utils/style";
import { useEffect, useState } from "react";
import {
  UseControllerProps,
  UseFormRegister,
  UseFormWatch,
  useController,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { SelectTrigger, Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type Props = {
  initialSemesters: Semester[];
  onChange: (semesters: Semester[]) => void;
};

type CalculatorForm = {
  semesters: Semester[];
};

export function Calculator({ initialSemesters, onChange }: Props) {
  const form = useForm<CalculatorForm>({
    defaultValues: { semesters: initialSemesters },
  });
  const semestersField = useFieldArray({ control: form.control, name: "semesters" });

  const semesters = form.watch("semesters");
  const gpa = calculateCumGpa(semesters).toFixed(2);

  const credits = numCreditsSemesters(semesters);

  useEffect(() => {
    onChange(form.watch("semesters"));
  }, [form.watch()]);

  return (
    <div className="h-full space-y-6">
      {semestersField.fields.map((semesterField, i) => {
        const semesterArrayPrefix = `semesters.${i}` as const;
        return (
          <div key={i} className="border rounded-xl p-5">
            <div className="flex items-center gap-2">
              <Input
                {...form.register(`${semesterArrayPrefix}.name`)}
                underline
                placeholder="Semester name"
                className="text-lg"
              />
              <Button onClick={() => semestersField.remove(i)} variant={"ghost"} size={"sm"}>
                <FaRegTrashCan />
              </Button>
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
            courses: [],
          })
        }
        variant={"secondary"}
      >
        Add semester
      </Button>

      <div className="bg-gray-100 p-5 rounded-xl tabular-nums font-black text-5xl">
        <span className="text-gray-400">{credits} credits</span> {gpa}
        <span className="text-gray-400">/4</span>
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
      {coursesField.fields.map((field, i) => {
        return (
          <div key={i}>
            <div className="flex flex-col md:flex-row md:items-center space-y-1 md:space-y-0 md:space-x-2">
              <div className="flex-1 flex items-center gap-2">
                <Input {...register(`semesters.${nestIndex}.courses.${i}.name`)} placeholder="Course name" />
                <Input
                  {...register(`semesters.${nestIndex}.courses.${i}.credits`)}
                  type="number"
                  placeholder="Credits"
                  className="w-[5rem]"
                />
                <Select value={field.grade ?? undefined}>
                  <SelectTrigger className="w-[5rem]">
                    <SelectValue placeholder="Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {letterGrades.map((grade) => (
                      <SelectItem value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex items-center justify-between">
        <Button
          onClick={() =>
            coursesField.append({
              name: "",
              grade: "B",
              credits: 4,
            })
          }
          variant={"secondary"}
        >
          Add course
        </Button>
        <div className="text-2xl font-bold tabular-nums">
          <span className="text-gray-400">{credits} credits</span> {gpa} <span className="text-gray-400">/4</span>
        </div>
      </div>
    </div>
  );
}

function GradeInput2(props: UseControllerProps<CalculatorForm>) {
  const { field } = useController(props);

  const [index, setIndex] = useState(0);

  return (
    <div className="flex items-center gap-2">
      <button className="text-sm text-gray-500">
        <FaChevronLeft />
      </button>
      <div className="text-lg font-bold">{letterGrades[index]}</div>
      <button className="text-sm text-gray-500">
        <FaChevronRight />
      </button>
    </div>
    // <div className="flex gap-2">
    //   <div className="md:w-[16rem] lg:w-[20rem] whitespace-nowrap overflow-scroll">
    //     <div>
    //       {letterGrades.map((letterGrade) => {
    //         const isSelected = field.value === letterGrade;
    //         return (
    //           <Button
    //             key={letterGrade}
    //             onClick={() => field.onChange(isSelected ? null : letterGrade)}
    //             variant={isSelected ? "secondary" : "ghost"}
    //           >
    //             {letterGrade}
    //           </Button>
    //         );
    //       })}
    //     </div>
    //   </div>

    //   <div className="flex-1 flex items-center justify-center">
    //     <div className={cn("size-2 rounded-full", { "bg-yellow-400": !field.value })}></div>
    //   </div>
    // </div>
  );
}
function GradeInput(props: UseControllerProps<CalculatorForm>) {
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
