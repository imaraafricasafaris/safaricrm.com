import { cn } from "@/lib/utils"

export const dialogContentStyles = cn(
  "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg md:w-full",
  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
)

export const dialogHeaderStyles = "flex flex-col space-y-1.5 text-center sm:text-left"

export const dialogTitleStyles = "text-lg font-semibold leading-none tracking-tight"

export const dialogDescriptionStyles = "text-sm text-gray-500 dark:text-gray-400"

export const dialogFooterStyles = "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"

export const alertDialogContentStyles = cn(
  dialogContentStyles,
  "max-w-[425px]"
)

export const cardStyles = cn(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  "hover:shadow-md transition-shadow duration-200"
)

export const profileCardStyles = cn(
  cardStyles,
  "p-6 grid gap-4"
)

export const taskCardStyles = cn(
  cardStyles,
  "p-4 hover:bg-accent/5"
)

export const activityLogCardStyles = cn(
  cardStyles,
  "p-4 hover:bg-accent/5 relative overflow-hidden"
)

export const badgeVariantStyles = {
  default: "bg-primary/10 text-primary hover:bg-primary/20",
  success: "bg-green-100 text-green-700 hover:bg-green-200",
  warning: "bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
  danger: "bg-red-100 text-red-700 hover:bg-red-200",
  info: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  outline: "text-foreground",
}
