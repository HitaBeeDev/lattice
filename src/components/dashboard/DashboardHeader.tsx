type DashboardHeaderProps = {
  formattedDate: string;
  greeting: string;
  onAddTask: () => void;
};

export default function DashboardHeader({
  formattedDate,
  greeting,
  onAddTask,
}: DashboardHeaderProps) {
  return (
    <header>
      <div>
        <h1>{greeting}</h1>
        <p>Here is your daily productivity summary for {formattedDate}.</p>
      </div>

      <button onClick={onAddTask} type="button">
        <span>+</span>
        Add Task
      </button>
    </header>
  );
}
