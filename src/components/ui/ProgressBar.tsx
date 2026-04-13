type ProgressBarProps = {
    className?: string;
    label?: string;
    value: number;
};
export default function ProgressBar({ label, value }: ProgressBarProps) {
    const safeValue = Math.min(100, Math.max(0, value));
    return (<div>
      {label && (<div>
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>)}
      <progress aria-label={label ?? "Progress"} max={100} value={safeValue}/>
    </div>);
}
