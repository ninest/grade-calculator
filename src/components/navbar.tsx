import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="flex items-center justify-between p-5 border-b">
      <div className="font-bold">Grade Calculator</div>
      <div>
        <Button>Print</Button>
      </div>
    </header>
  );
}
