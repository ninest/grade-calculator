import { Navbar } from "@/components/navbar";
import { Calculator } from "./calculator-form";

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
