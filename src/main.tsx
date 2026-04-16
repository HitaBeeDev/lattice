import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import Container from "./components/layout/Container";
import { PageLoader } from "./components/ui";

const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const HabitTrackerPage = lazy(() => import("./pages/HabitTrackerPage"));
const TaskListPage = lazy(() => import("./pages/TaskListPage"));
const PomodoroPage = lazy(() => import("./pages/PomodoroPage"));

const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element #root was not found.");
}
ReactDOM.createRoot(rootElement).render(<React.StrictMode>
    <BrowserRouter>
      <App>
        <Container>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<DashboardPage />}/>
              <Route path="/dashboard" element={<DashboardPage />}/>
              <Route path="/habit-tracker" element={<HabitTrackerPage />}/>
              <Route path="/tasks" element={<TaskListPage />}/>
              <Route path="/pomodoro" element={<PomodoroPage />}/>
            </Routes>
          </Suspense>
        </Container>
      </App>
    </BrowserRouter>
  </React.StrictMode>);
