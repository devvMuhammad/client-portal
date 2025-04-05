import { CheckIcon } from "lucide-react";

// Reusable components
export function CheckListItem({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <li>
      <CheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
      {children}
    </li>
  );
}