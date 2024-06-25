import { Tab } from "@/routes/gpa-calculator/use-storage";

export function encodeTabShareData(tab: Tab) {
  const data = btoa(JSON.stringify(tab));
  return data;
}

export function decodeShareTabData(data: string) {
  const tab = JSON.parse(atob(data)) as Tab;
  return tab;
}
