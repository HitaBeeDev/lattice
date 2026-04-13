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
