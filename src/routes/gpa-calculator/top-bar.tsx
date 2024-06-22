import { tabsAtom } from "@/routes/gpa-calculator/use-storage";
import { cn } from "@/utils/style";
import cuid from "cuid";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

export function TopBar({ currentTabId }: { currentTabId: undefined | string }) {
  const navigate = useNavigate();
  const [tabs, setTabs] = useAtom(tabsAtom);

  const newTab = () => {
    setTabs([
      ...tabs,
      {
        id: cuid(),
        name: "New Grades",
        semesters: [
          {
            name: "Semester 1",
            courses: [
              {
                name: "",
                grade: "B",
                credits: 4,
              },
              {
                name: "",
                grade: "B",
                credits: 4,
              },
            ],
          },
        ],
      },
    ]);
  };

  const changeTabName = (text: string) => {
    const tab = tabs.find((tab) => tab.id === currentTabId);
    if (!tab) return;

    const newTab = { ...tab, name: text };

    const tabIndex = tabs.findIndex((tab) => tab.id === currentTabId);
    const newTabs = [...tabs];
    newTabs[tabIndex] = newTab;

    if (JSON.stringify(tabs) !== JSON.stringify(newTabs)) {
      setTabs(newTabs);
    }
  };

  return (
    <header className="px-5 py-3 border-b flex items-center gap-2">
      {tabs.map((tab) => {
        const isSelected = currentTabId === tab.id;
        return (
          <TabButton
            key={tab.id}
            isSelected={isSelected}
            text={tab.name}
            onClick={() => navigate(`/${tab.id}`)}
            onTextChange={changeTabName}
          />
        );
      })}
      <button onClick={newTab} className="px-2 py-1 border rounded-lg flex items-center">
        +
      </button>
    </header>
  );
}

function TabButton({
  isSelected,
  text,
  onClick,
  onTextChange,
}: {
  isSelected: boolean;
  text: string;
  onClick: () => void;
  onTextChange: (text: string) => void;
}) {
  const setTitle = (text: null | string) => {
    if (!text || text.trim() === "") return;

    console.log(text);

    onTextChange(text.replaceAll("\n", ""));
  };

  return (
    <button
      onClick={() => onClick()}
      className={cn(
        "px-4 py-1 border rounded-lg",
        { "bg-gray-50": !isSelected, "bg-gray-200": isSelected },
        "flex items-center gap-2"
      )}
    >
      {isSelected ? (
        <div
          contentEditable
          onBlur={(e) => {
            setTitle(e.currentTarget.textContent);
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter") {
              setTitle(e.currentTarget.textContent);
              window.focus();
            }
          }}
          children={text.replaceAll("\n", "")}
        />
      ) : (
        <div>{text}</div>
      )}
    </button>
  );
}
