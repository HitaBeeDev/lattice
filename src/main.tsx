import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import Container from "./Components/Container";
import HabitTrackerPage from "./Components/HabitSection/HabitTrackerPage";
import HomePage from "./Components/HomePage";
import TimeTrackerPage from "./Components/TimeTracker/TimeTrackerPage";
import ToDoListPage from "./Components/ToDoListSection/ToDoListPage";


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
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<HomePage />} />
              <Route path="/habit-tracker" element={<HabitTrackerPage />} />
              <Route path="/ToDo-List" element={<ToDoListPage />} />
              <Route path="/Pomodoro-Timer" element={<TimeTrackerPage />} />
            </Routes>
          </Container>
        </App>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
