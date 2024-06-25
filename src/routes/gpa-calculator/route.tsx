import { Semester } from "@/routes/gpa-calculator/calculator";
import { TopBar } from "@/routes/gpa-calculator/top-bar";
import { tabsAtom } from "@/routes/gpa-calculator/use-storage";
import { useAtom } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { Calculator } from "./calculator-form";
import { encodeTabShareData } from "@/routes/share-grades/share";

export function GPACalculatorRoute() {
  const navigate = useNavigate();
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
  }, 50);

  const onTabDelete = () => {
    if (!currentTab) return;

    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    const newTabs = [...tabs];
    newTabs.splice(tabIndex, 1);

    if (JSON.stringify(tabs) !== JSON.stringify(newTabs)) {
      setTabs(newTabs);
      navigate("/");
    }
  };

  const onShare = () => {
    if (!currentTab) return;

    const data = encodeTabShareData(currentTab);
    const link = window.location.origin + `/share/${data}`;
    window.prompt("Copy and share the link:", link);
  };

  return (
    <>
      <TopBar currentTabId={tabId} />

      <div className="">
        {currentTab && (
          <Calculator
            key={currentTab.id}
            initialSemesters={currentTab.semesters}
            onChange={onTabChange}
            onDelete={onTabDelete}
            onShare={onShare}
          />
        )}
      </div>
    </>
  );
}
