import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  override?: boolean;
  hoverTransition?: boolean;
}

export default function CustomCard({
  override = false,
  className,
  hoverTransition = true,
  children,
  ...props
}: Props) {
  return (
    <div
      style={{
        transition:
          "transform 250ms ease, box-shadow 250ms ease, color 250ms ease",
        boxShadow: "1px 1px 5px 0 rgba(1, 1, 1, 0.05)",
      }}
      {...props}
      className={cn(
        override ? "" : "bg-white p-8 flex flex-col rounded-xl",
        className,
        hoverTransition ? "hover:-translate-y-2" : ""
      )}
    >
      {children}
    </div>
  );
}
