import { Semester } from "@/routes/gpa-calculator/calculator";
import { atom, useAtom } from "jotai";
import cuid from "cuid";
import { atomWithStorage } from "jotai/utils";

export const CURRENT_TAB_VERSION = "0";
export type Tab = {
  version: string;
  id: string;
  name: string;
  semesters: Semester[];
};

export const tabsAtom = atomWithStorage<Tab[]>("tabs", [
  {
    version: CURRENT_TAB_VERSION,
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

const tabIdsAtom = atom((get) => get(tabsAtom).map((tab) => tab.id));

export function useTabExists(id: string) {
  const [tabIds] = useAtom(tabIdsAtom);
  return tabIds.includes(id);
}
