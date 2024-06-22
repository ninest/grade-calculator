import { Semester } from "@/routes/gpa-calculator/calculator";
import { TopBar } from "@/routes/gpa-calculator/top-bar";
import { tabsAtom } from "@/routes/gpa-calculator/use-storage";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Calculator } from "./calculator-form";

export function GPACalculatorRoute() {
  const { tabId } = useParams<{ tabId?: string }>();

  const [tabs, setTabs] = useAtom(tabsAtom);
  const currentTab = tabs.find((tab) => tab.id === tabId);

  const onTabChange = useDebouncedCallback((semesters: Semester[]) => {
    if (!currentTab) return;

    const newTab = { ...currentTab, semesters };

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = [...tabs];
    newTabs[tabIndex] = newTab;

    if (JSON.stringify(tabs) !== JSON.stringify(newTabs)) {
      setTabs(newTabs);
    }
  }, 300);

  return (
    <>
      <TopBar currentTabId={tabId} />

      <div className="p-5">
        {currentTab && (
          <Calculator key={currentTab.id} initialSemesters={currentTab.semesters} onChange={onTabChange} />
        )}
      </div>

      <pre className="bg-black text-white text-xs">{JSON.stringify({ currentTab, tabs }, null, 2)}</pre>
    </>
  );
}
