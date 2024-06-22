import { Semester } from "@/routes/gpa-calculator/calculator";
import { atom } from "jotai";
import cuid from 'cuid'
import { atomWithStorage } from "jotai/utils";

export type Tab = {
  id: string;
  name: string;
  semesters: Semester[];
};

export const tabsAtom = atomWithStorage<Tab[]>("tabs", [
  {
    id: cuid(),
    name: "My Grades",
    semesters: [
      {
        name: "Fall 2021",
        courses: [],
      },
    ],
  },
]);

export const firstTabAtom = atom((get) => get(tabsAtom)[0]);
