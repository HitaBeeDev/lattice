import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import Container from "./components/Container";
import DashboardPage from "./pages/DashboardPage";
import HabitTrackerPage from "./pages/HabitTrackerPage";
import ToDoListPage from "./pages/ToDoListPage";
import PomodoroPage from "./pages/PomodoroPage";


const rootElement = document.getElementById("root");
const queryClient = new QueryClient();

if (!rootElement) {
  throw new Error("Root element #root was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App>
          <Container>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/habit-tracker" element={<HabitTrackerPage />} />
              <Route path="/ToDo-List" element={<ToDoListPage />} />
              <Route path="/Pomodoro-Timer" element={<PomodoroPage />} />
            </Routes>
          </Container>
        </App>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
