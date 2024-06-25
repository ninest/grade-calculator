import * as React from "react";

import { cn } from "@/utils/style";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  underline?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, underline, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full bg-background px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        { "rounded-md border-2 border-input focus:border-primary": !underline },
        { "rounded-none border-b-2 border-input focus:border-primary": underline },
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
