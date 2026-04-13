import type { ReactNode } from "react";
type EmptyStateProps = {
    action?: ReactNode;
    className?: string;
    description: string;
    title: string;
};
export default function EmptyState({ action, description, title, }: EmptyStateProps) {
    return (<div>
      <div>
        <h3>{title}</h3>
        <p>{description}</p>
        {action && <div>{action}</div>}
      </div>
    </div>);
}
