import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import Container from "./components/layout/Container";
import DashboardPage from "./pages/DashboardPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import ToDoListPage from "./pages/ToDoListPage";
import PomodoroPage from "./pages/PomodoroPage";
// Clear stale timer analytics once so the mock defaults in mockData.ts take effect.
// Bump the version string whenever mockTimerAnalytics changes.
const ANALYTICS_RESET_VERSION = "nexstep:analytics-reset:v1";
if (localStorage.getItem(ANALYTICS_RESET_VERSION) !== "true") {
  localStorage.removeItem("timer-session-analytics");
  localStorage.setItem(ANALYTICS_RESET_VERSION, "true");
}

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element #root was not found.");
}
ReactDOM.createRoot(rootElement).render(<React.StrictMode>
    <BrowserRouter>
      <App>
        <Container>
          <Routes>
            <Route path="/" element={<DashboardPage />}/>
            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/habit-tracker" element={<HabitTrackerPage />}/>
            <Route path="/tasks" element={<ToDoListPage />}/>
            <Route path="/pomodoro" element={<PomodoroPage />}/>
          </Routes>
        </Container>
      </App>
      <Toaster />
    </BrowserRouter>
  </React.StrictMode>);
