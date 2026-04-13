import { CalendarDays, Plus, Sparkles } from "lucide-react";
import { Button } from "../ui";
type DashboardHeaderProps = {
    formattedDate: string;
    greeting: string;
    onAddTask: () => void;
};
export default function DashboardHeader({ formattedDate, greeting, onAddTask, }: DashboardHeaderProps) {
    return (<header>
      <div>
        <div>
          <Sparkles aria-hidden="true"/>
          Dashboard
        </div>
        <div>
          <h1>
            {greeting}
          </h1>
          <p>{formattedDate}</p>
        </div>
      </div>

      <div>
        <div>
          <CalendarDays aria-hidden="true"/>
          {formattedDate}
        </div>
        <Button onClick={onAddTask} type="button">
          <Plus aria-hidden="true" strokeWidth={2.5}/>
          Add Task
        </Button>
      </div>
    </header>);
}
