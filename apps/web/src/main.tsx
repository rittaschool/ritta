import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles/index.css";

// Init languages
import "./i18n";

// Import templates
import Dashboard from "./templates/Dashboard";
import Auth from "./templates/Auth";
import Admin from "./templates/Admin";

// Pages
import Home from "./pages/Home";
import MessagesList, { MailBox } from "./pages/MessagesList";
import Login from "./pages/auth/Login";
import LogOut from "./pages/auth/LogOut";
import AdminHome from "./pages/admin/Home";
import OldLogin from "./pages/auth/OldLogin";
import CreateMessage from "./pages/CreateMessage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="messages">
            <Route path="sent" element={<MessagesList box={MailBox.SENT} />} />
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
          {/* <Route path="teams" element={<Teams />}>
            <Route path=":teamId" element={<Team />} />
            <Route path="new" element={<NewTeamForm />} />
            <Route index element={<LeagueStandings />} />
          </Route> */}
        </Route>
        <Route path="/auth" element={<Auth />}>
          <Route index element={<Navigate to="/auth/login" />} />
          <Route path="login" element={<Login />} />
          <Route path="logout" element={<LogOut />} />
          <Route path="old" element={<OldLogin />} />
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
  </React.StrictMode>
);
