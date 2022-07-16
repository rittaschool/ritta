import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./styles/index.css";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

// Init languages
import "./i18n";

// Import templates
import Admin from "./templates/Admin";
import Auth from "./templates/Auth";
import Dashboard from "./templates/Dashboard";

// Pages
import AdminHome from "./pages/admin/Home";
import Login from "./pages/auth/Login";
import LogOut from "./pages/auth/LogOut";
import CreateMessage from "./pages/CreateMessage";
import Home from "./pages/Home";
import MessagesList, { MailBox } from "./pages/MessagesList";
import ThreadView from "./pages/ThreadView";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="messages">
              <Route path=":id" element={<ThreadView />} />
              <Route
                path="sent"
                element={<MessagesList box={MailBox.SENT} />}
              />
              <Route
                path="drafts"
                element={<MessagesList box={MailBox.DRAFTS} />}
              />
              <Route
                path="archive"
                element={<MessagesList box={MailBox.ARCHIVE} />}
              />
              <Route path="new" element={<CreateMessage />} />
              <Route index element={<MessagesList box={MailBox.INBOX} />} />
            </Route>
          </Route>
          <Route path="/auth" element={<Auth />}>
            <Route index element={<Navigate to="/auth/login" />} />
            <Route path="login" element={<Login />} />
            <Route path="logout" element={<LogOut />} />
            {/* <Route path="teams" element={<Teams />}>
            <Route path=":teamId" element={<Team />} />
            <Route path="new" element={<NewTeamForm />} />
            <Route index element={<LeagueStandings />} />
          </Route> */}
          </Route>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<AdminHome />} />

            {/* <Route path="teams" element={<Teams />}>
            <Route path=":teamId" element={<Team />} />
            <Route path="new" element={<NewTeamForm />} />
            <Route index element={<LeagueStandings />} />
          </Route> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
