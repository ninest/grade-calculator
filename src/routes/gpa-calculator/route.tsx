import { Navbar } from "@/components/navbar";
import { tabsAtom } from "@/routes/gpa-calculator/use-storage";
import { cn } from "@/utils/style";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { Calculator } from "./calculator-form";
import { Semester } from "@/routes/gpa-calculator/calculator";
import { useDebouncedCallback } from "use-debounce";
import cuid from "cuid";

export function GPACalculatorRoute() {
  const { tabId } = useParams<{ tabId?: string }>();
  const navigate = useNavigate();

  const [tabs, setTabs] = useAtom(tabsAtom);
  const currentTab = tabs.find((tab) => tab.id === tabId);

  const newTab = () => {
    setTabs([
      ...tabs,
      {
        id: cuid(),
        name: "New",
        semesters: [],
      },
    ]);
  };

  const onTabChange = useDebouncedCallback((semesters: Semester[]) => {
    console.log("change!");
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
      <Navbar />

      <div className="p-5 flex gap-2">
        {tabs.map((tab) => {
          const isSelected = tabId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => (isSelected ? navigate(`/`) : navigate(`/${tab.id}`))}
              className={cn("px-2 py-1 border rounded-lg", { "bg-gray-50": !isSelected, "bg-gray-200": isSelected })}
            >
              {tab.name}
            </button>
          );
        })}
        <button onClick={newTab}>+</button>
      </div>

      <div className="p-5">
        {currentTab && (
          <Calculator key={currentTab.id} initialSemesters={currentTab.semesters} onChange={onTabChange} />
        )}
      </div>

      <pre className="bg-black text-white text-xs">{JSON.stringify({ currentTab, tabs }, null, 2)}</pre>
    </>
  );
}
