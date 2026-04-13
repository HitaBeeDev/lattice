type BadgeProps = {
    children: string;
    className?: string;
    variant: "high" | "medium" | "low";
};
export default function Badge({ children }: BadgeProps) {
    return (<span>
      {children}
    </span>);
}
