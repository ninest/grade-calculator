import { GradeReport } from "@/components/grade-report";
import { Button } from "@/components/ui/button";
import { tabsAtom, useTabExists } from "@/routes/gpa-calculator/use-storage";
import { decodeShareTabData, encodeTabShareData } from "@/routes/share-grades/share";
import { useAtom } from "jotai";
import { FaShareAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

export function ShareGradesRoute() {
  const navigate = useNavigate();
  const { data } = useParams<{ data: string }>();
  if (!data) {
    return navigate("/");
  }

  const tab = decodeShareTabData(data);
  const tabExists = useTabExists(tab.id);

  const onShare = () => {
    const data = encodeTabShareData(tab);
    const link = window.location.origin + `/share/${data}`;
    window.prompt("Copy and share the link:", link);
  };

  const [tabs, setTabs] = useAtom(tabsAtom);
  const save = () => {
    setTabs([...tabs, tab]);
    navigate(`/${tab.id}`);
  };

  const saveAs = () => {
    const existingTabIndex = tabs.findIndex((t) => t.id === tab.id);

    const newTabs = [...tabs];
    newTabs[existingTabIndex] = tab;

    if (JSON.stringify(tabs) !== JSON.stringify(newTabs)) {
      setTabs(newTabs);
    }
    navigate(`/${tab.id}`);
  };

  return (
    <>
      <div className="p-5">
        <GradeReport tab={tab} />

        <div className="mt-5 p-5 border rounded-md flex items-center justify-between gap-2">
          {tabExists ? (
            <Button onClick={saveAs} variant={"secondary"}>
              Save as {tab.name}
            </Button>
          ) : (
            <Button onClick={save} variant={"secondary"}>
              Save
            </Button>
          )}
          <Button onClick={onShare} variant={"secondary"}>
            <FaShareAlt className="mr-2" /> Share
          </Button>
        </div>
      </div>
    </>
  );
}
