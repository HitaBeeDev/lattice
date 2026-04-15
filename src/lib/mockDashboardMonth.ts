export interface MockDashboardHabitEntry {
  name: string;
  completed: boolean;
}

export interface MockDashboardTodoEntry {
  task: string;
  done: boolean;
  spanDays?: number;
  variant?: "dark" | "light";
}

export interface MockDashboardDay {
  day: string;
  date: string;
  focusTimeMinutes: number;
  habits: MockDashboardHabitEntry[];
  todos: MockDashboardTodoEntry[];
}

export interface MockDashboardWeek {
  week: number;
  days: MockDashboardDay[];
}

export interface MockMultiDayTask {
  id: string;
  title: string;
  subtitle: string;
  startDate: string; // ISO "YYYY-MM-DD"
  endDate: string;   // ISO "YYYY-MM-DD" (inclusive)
  startHour: number;
  variant: "dark" | "light";
}

export interface MockDashboardMonth {
  name: string;
  month: string;
  year: number;
  weeks: MockDashboardWeek[];
  multiDayTasks: MockMultiDayTask[];
}

const BASE_CURRENT_WEEK_MONDAY = "2026-03-23";

const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (isoDate: string): Date => {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const getMondayOf = (date: Date): Date => {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);

  const weekday = monday.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  monday.setDate(monday.getDate() + offset);

  return monday;
};

const shiftIsoDate = (isoDate: string, dayOffset: number): string => {
  const shifted = parseLocalDate(isoDate);
  shifted.setDate(shifted.getDate() + dayOffset);
  return formatLocalDate(shifted);
};

const shiftDashboardMonthDates = (
  dashboardMonth: MockDashboardMonth,
): MockDashboardMonth => {
  const baseMonday = parseLocalDate(BASE_CURRENT_WEEK_MONDAY);
  const targetMonday = getMondayOf(new Date());
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const dayOffset = Math.round(
    (targetMonday.getTime() - baseMonday.getTime()) / millisecondsPerDay,
  );

  return {
    ...dashboardMonth,
    month: targetMonday.toLocaleString("en-US", { month: "long" }),
    year: targetMonday.getFullYear(),
    multiDayTasks: dashboardMonth.multiDayTasks.map((task) => ({
      ...task,
      startDate: shiftIsoDate(task.startDate, dayOffset),
      endDate: shiftIsoDate(task.endDate, dayOffset),
    })),
    weeks: dashboardMonth.weeks.map((week) => ({
      ...week,
      days: week.days.map((day) => ({
        ...day,
        date: shiftIsoDate(day.date, dayOffset),
      })),
    })),
  };
};

const baseMockDashboardMonth: MockDashboardMonth = {
  name: "Layla",
  month: "March",
  year: 2026,
  multiDayTasks: [
    {
      id: "mdt-1",
      title: "QBR Narrative Draft",
      subtitle: "Align delivery milestones and risks",
      startDate: "2026-03-17",
      endDate: "2026-03-20",
      startHour: 14,
      variant: "dark",
    },
    {
      id: "mdt-2",
      title: "Vendor Review",
      subtitle: "Finalize scoring with procurement",
      startDate: "2026-03-19",
      endDate: "2026-03-20",
      startHour: 16,
      variant: "light",
    },
    {
      id: "mdt-3",
      title: "CRM Migration Cutover",
      subtitle: "Coordinate launch readiness across teams",
      startDate: "2026-03-23",
      endDate: "2026-03-26",
      startHour: 15,
      variant: "dark",
    },
    {
      id: "mdt-4",
      title: "Leadership Review Pack",
      subtitle: "Prep summary for Thursday steering meeting",
      startDate: "2026-03-24",
      endDate: "2026-03-25",
      startHour: 17,
      variant: "light",
    },
    {
      id: "mdt-7",
      title: "Mitigation Plan Update",
      subtitle: "Refine actions for remaining launch risk",
      startDate: "2026-03-26",
      endDate: "2026-03-28",
      startHour: 18,
      variant: "dark",
    },
    {
      id: "mdt-5",
      title: "Project Falcon Kickoff",
      subtitle: "Stand up workstreams and owners",
      startDate: "2026-03-30",
      endDate: "2026-04-02",
      startHour: 16,
      variant: "dark",
    },
  ],
  weeks: [
    {
      week: 1,
      days: [
        {
          day: "Monday",
          date: "2026-03-02",
          focusTimeMinutes: 185,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Review project RAID log", done: true },
            { task: "Update steering committee agenda", done: false },
            { task: "Confirm milestone owners with product", done: true },
            { task: "Send Monday priorities to team leads", done: true },
          ],
        },
        {
          day: "Tuesday",
          date: "2026-03-03",
          focusTimeMinutes: 140,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Run cross-functional standup", done: true },
            { task: "Follow up on blocked engineering ticket", done: true },
            { task: "Review vendor proposal revisions", done: false },
            { task: "Share status note with finance", done: true },
          ],
        },
        {
          day: "Wednesday",
          date: "2026-03-04",
          focusTimeMinutes: 220,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Prepare sprint health snapshot", done: true },
            { task: "Resolve resourcing conflict for QA", done: false },
            { task: "Review delivery timeline with design", done: true },
            { task: "Approve updated implementation plan", done: true },
          ],
        },
        {
          day: "Thursday",
          date: "2026-03-05",
          focusTimeMinutes: 115,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Facilitate stakeholder checkpoint", done: true },
            { task: "Draft decision log entries", done: true },
            { task: "Escalate budget variance", done: false },
            { task: "Align acceptance criteria with QA", done: true },
          ],
        },
        {
          day: "Friday",
          date: "2026-03-06",
          focusTimeMinutes: 95,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Review weekly delivery metrics", done: true },
            { task: "Close resolved action items", done: true },
            { task: "Publish Friday project summary", done: true },
            { task: "Chase overdue dependency sign-off", done: false },
          ],
        },
        {
          day: "Saturday",
          date: "2026-03-07",
          focusTimeMinutes: 75,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Outline next week's priorities", done: true },
            { task: "Review notes from client workshop", done: true },
            { task: "Organize leadership readout files", done: true },
            { task: "Draft open questions for Monday", done: false },
          ],
        },
        {
          day: "Sunday",
          date: "2026-03-08",
          focusTimeMinutes: 55,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Review upcoming milestone calendar", done: true },
            { task: "Finalize Monday talking points", done: true },
            { task: "Clean up project workspace", done: true },
            { task: "Recheck budget tracker", done: true },
          ],
        },
      ],
    },
    {
      week: 2,
      days: [
        {
          day: "Monday",
          date: "2026-03-09",
          focusTimeMinutes: 200,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Review release readiness checklist", done: true },
            { task: "Reprioritize backlog with product", done: false },
            { task: "Confirm staffing plan for next sprint", done: true },
            { task: "Send risks summary to leadership", done: true },
          ],
        },
        {
          day: "Tuesday",
          date: "2026-03-10",
          focusTimeMinutes: 125,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Lead weekly project standup", done: true },
            { task: "Clear vendor decision backlog", done: true },
            { task: "Update action tracker after standup", done: true },
            { task: "Resolve delayed legal review", done: false },
          ],
        },
        {
          day: "Wednesday",
          date: "2026-03-11",
          focusTimeMinutes: 240,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Prepare operating review dashboard", done: true },
            { task: "Review implementation estimates", done: true },
            { task: "Align engineering and data dependencies", done: true },
            { task: "Record stakeholder update video", done: true },
          ],
        },
        {
          day: "Thursday",
          date: "2026-03-12",
          focusTimeMinutes: 110,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Facilitate product requirement review", done: true },
            { task: "Approve final UAT participant list", done: true },
            { task: "Refine mitigation plan for blockers", done: true },
            { task: "Archive closed meeting notes", done: true },
          ],
        },
        {
          day: "Friday",
          date: "2026-03-13",
          focusTimeMinutes: 90,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Review KPI deltas with operations", done: true },
            { task: "Close approved change requests", done: true },
            { task: "Publish week-end recap", done: true },
            { task: "Audit open approvals in inbox", done: true },
          ],
        },
        {
          day: "Saturday",
          date: "2026-03-14",
          focusTimeMinutes: 80,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Sketch next quarter initiative themes", done: true },
            { task: "Review notes from customer interviews", done: true },
            { task: "Clean up roadmap deck", done: true },
            { task: "Draft staffing asks for April", done: false },
          ],
        },
        {
          day: "Sunday",
          date: "2026-03-15",
          focusTimeMinutes: 60,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Finalize next week's meeting cadence", done: true },
            { task: "Review unresolved action items", done: true },
            { task: "Update project budget tracker", done: true },
            { task: "Prepare questions for steering review", done: true },
          ],
        },
      ],
    },
    {
      week: 3,
      days: [
        {
          day: "Monday",
          date: "2026-03-16",
          focusTimeMinutes: 210,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Draft QBR storyline with department leads", done: true },
            { task: "Review late milestone risk with engineering", done: false },
            { task: "Finalize sprint goals for platform team", done: true },
            { task: "Sync delivery dependencies with data team", done: true },
          ],
        },
        {
          day: "Tuesday",
          date: "2026-03-17",
          focusTimeMinutes: 135,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Run blocker triage with workstream leads", done: true },
            { task: "Reply to leadership follow-up questions", done: true },
            { task: "Revise rollout comms draft", done: false },
            { task: "Confirm procurement review timing", done: true },
          ],
        },
        {
          day: "Wednesday",
          date: "2026-03-18",
          focusTimeMinutes: 255,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Consolidate operating review metrics", done: true },
            { task: "Chair steering prep meeting", done: true },
            { task: "Refine cross-team launch checklist", done: true },
            { task: "Review QA entry criteria", done: true },
          ],
        },
        {
          day: "Thursday",
          date: "2026-03-19",
          focusTimeMinutes: 120,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Walk stakeholders through delivery options", done: true },
            { task: "Update project assumptions log", done: true },
            { task: "Approve revised implementation scope", done: true },
            { task: "Clear remaining inbox escalations", done: false },
          ],
        },
        {
          day: "Friday",
          date: "2026-03-20",
          focusTimeMinutes: 85,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Publish Friday status report", done: true },
            { task: "Review roadmap changes with product", done: true },
            { task: "Update RAID owners after review", done: true },
            { task: "Send nudges for pending approvals", done: true },
          ],
        },
        {
          day: "Saturday",
          date: "2026-03-21",
          focusTimeMinutes: 78,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
          ],
          todos: [
            { task: "Review board meeting prep notes", done: true },
            { task: "Organize follow-up actions by owner", done: true },
            { task: "Refresh hiring panel schedule", done: true },
            { task: "Draft Monday checkpoint questions", done: false },
          ],
        },
        {
          day: "Sunday",
          date: "2026-03-22",
          focusTimeMinutes: 58,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
          ],
          todos: [
            { task: "Finalize upcoming week priorities", done: true },
            { task: "Review open budget exceptions", done: true },
            { task: "Prepare weekly reflection notes", done: true },
            { task: "Reset project tracker views", done: true },
          ],
        },
      ],
    },
    {
      week: 4,
      days: [
        {
          day: "Monday",
          date: "2026-03-23",
          focusTimeMinutes: 225,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: false },
          ],
          todos: [
            { task: "Kick off CRM migration cutover", done: true },
            { task: "Resolve open integration risk", done: false },
            { task: "Review architecture decision summary", done: true },
            { task: "Publish launch readiness tracker", done: true },
          ],
        },
        {
          day: "Tuesday",
          date: "2026-03-24",
          focusTimeMinutes: 165,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Run cutover status standup", done: true },
            { task: "Reply to leadership status requests", done: true },
            { task: "Chase delayed vendor rollback plan", done: false },
          ],
        },
        {
          day: "Wednesday",
          date: "2026-03-25",
          focusTimeMinutes: 280,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Review go-live readiness metrics", done: true },
            {
              task: "Consolidate executive talking points",
              done: true,
              spanDays: 3,
              variant: "dark",
            },
            { task: "Validate UAT sign-off coverage", done: true },
            { task: "Approve hotfix rollout sequence", done: true },
          ],
        },
        {
          day: "Thursday",
          date: "2026-03-26",
          focusTimeMinutes: 135,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: false },
          ],
          todos: [
            { task: "Lead steering committee review", done: true },
          ],
        },
        {
          day: "Friday",
          date: "2026-03-27",
          focusTimeMinutes: 98,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Schedule post-launch issue review", done: false },
            { task: "", done: false },
            { task: "Send Friday handoff to stakeholders", done: true },
          ],
        },
        {
          day: "Saturday",
          date: "2026-03-28",
          focusTimeMinutes: 82,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: false },
          ],
          todos: [
            { task: "Morning yoga flow", done: true },
            { task: "Visit weekend farmers market", done: true },
          ],
        },
        {
          day: "Sunday",
          date: "2026-03-29",
          focusTimeMinutes: 62,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Long walk by the river", done: true },
            { task: "Practice piano for 30 minutes", done: false },
          ],
        },
      ],
    },
    {
      week: 5,
      days: [
        {
          day: "Monday",
          date: "2026-03-30",
          focusTimeMinutes: 215,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Confirm workstream owners and backups", done: true },
            { task: "Review onboarding plan with operations", done: true },
            { task: "Escalate unresolved analytics dependency", done: false },
          ],
        },
        {
          day: "Tuesday",
          date: "2026-03-31",
          focusTimeMinutes: 170,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Review onboarding FAQ with support", done: true },
            { task: "Push finance for revised forecast inputs", done: false },
          ],
        },
        {
          day: "Wednesday",
          date: "2026-04-01",
          focusTimeMinutes: 260,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: true },
            { name: "Reading", completed: false },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Consolidate hiring panel recommendations", done: true },
            { task: "Refine steering update narrative", done: true },
            { task: "Validate engineering capacity assumptions", done: true },
          ],
        },
        {
          day: "Thursday",
          date: "2026-04-02",
          focusTimeMinutes: 145,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: true },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: false },
          ],
          todos: [
            { task: "Summarize decisions and owners", done: true },
            { task: "Review open onboarding blockers", done: true },
            { task: "Update governance tracker after meeting", done: true },
          ],
        },
        {
          day: "Friday",
          date: "2026-04-03",
          focusTimeMinutes: 102,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: false },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Review Falcon first-week delivery signal", done: true },
            { task: "Close hiring panel action items", done: true },
            { task: "Publish weekly portfolio summary", done: true },
            { task: "Schedule vendor contract review", done: false },
            { task: "Organize notes for Monday planning", done: true },
            { task: "Confirm next week's steering agenda", done: true },
          ],
        },
        {
          day: "Saturday",
          date: "2026-04-04",
          focusTimeMinutes: 84,
          habits: [
            { name: "Gym", completed: true },
            { name: "German", completed: false },
            { name: "Reading", completed: false },
            { name: "Journal", completed: true },
            { name: "Walk", completed: true },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: false },
          ],
          todos: [
            { task: "Review hiring notes for final candidates", done: true },
            { task: "Organize Falcon workshop materials", done: true },
            { task: "Refresh personal planning board", done: true },
            { task: "Draft follow-up questions for vendors", done: false },
            { task: "Sort archived decks by quarter", done: true },
            { task: "Prepare Monday meeting pack outline", done: true },
          ],
        },
        {
          day: "Sunday",
          date: "2026-04-05",
          focusTimeMinutes: 64,
          habits: [
            { name: "Gym", completed: false },
            { name: "German", completed: false },
            { name: "Reading", completed: true },
            { name: "Journal", completed: true },
            { name: "Walk", completed: false },
            { name: "Meditation", completed: true },
            { name: "No Sugar", completed: true },
          ],
          todos: [
            { task: "Finalize Monday portfolio priorities", done: true },
            { task: "Review next week's dependency calendar", done: true },
            { task: "Prepare summary of unresolved risks", done: true },
            { task: "Reset project command center notes", done: true },
            { task: "Organize stakeholder follow-up list", done: true },
            { task: "Write Sunday planning reflection", done: false },
          ],
        },
      ],
    },
  ],
};

export const mockDashboardMonth = shiftDashboardMonthDates(
  baseMockDashboardMonth,
);
