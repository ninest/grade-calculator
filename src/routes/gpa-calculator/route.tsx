import { Navbar } from "@/components/navbar";
import { Calculator } from "@/routes/gpa-calculator/calculator";

export function GPACalculatorRoute() {
  return (
    <>
      <Navbar />

      <div className="p-5">
        <Calculator />
      </div>
    </>
  );
}
