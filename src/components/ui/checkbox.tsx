import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked)
      }
      if (onChange) {
        onChange(e)
      }
    }

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-stone-300 dark:border-stone-600 bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "data-[state=checked]:bg-stone-900 dark:data-[state=checked]:bg-stone-100 data-[state=checked]:text-stone-100 dark:data-[state=checked]:text-stone-900",
            "appearance-none cursor-pointer transition-colors",
            checked && "bg-stone-900 dark:bg-stone-100 border-stone-900 dark:border-stone-100",
            className
          )}
          data-state={checked ? "checked" : "unchecked"}
          {...props}
        />
        {checked && (
          <Check className="absolute h-4 w-4 text-stone-100 dark:text-stone-900 pointer-events-none" />
        )}
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
