import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "../auth/Register";
import Login from "../auth/Login";

import ProtectedRoute from "./ProtectedRoute";

import Admin from "../admin/Admin";
import ScheduleInterview from "../admin/ScheduleInterview";
import Interviews from "../admin/Interviews";
import Reports from "../admin/Reports";

import Candidate from "../candidate/Candidate";


import AdminWaiting from "../components/shared/waiting/AdminWaiting";
import CandidateWaiting from "../components/shared/waiting/CandidateWaiting";

import AdminRoom from "../components/shared/room/AdminRoom";
import CandidateRoom from "../components/shared/room/CandidateRoom";

import ThankYou from "../candidate/ThankYou";
import Result from "../admin/Result";

import CodeEditor from "../components/editor/CodeEditor";

//errors
import LinkExpired from "../components/errors/LinkExpired";
import Invalid from "../components/errors/Invalid";
import SessionExpired from "../components/errors/SessionExpired";
import NotFound from "../components/errors/NotFound";

import Home from "../components/home/Home";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<Home/>} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/*candidate login */}
        <Route path="/login/:roomId" element={<Login />} />


        {/* CANDIDATE ROUTE */}

        <Route
          path="/candidate"
          element={
            <ProtectedRoute role="candidate">
              <Candidate />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/schedule"
          element={
            <ProtectedRoute role="admin">
              <ScheduleInterview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/interviews"
          element={
            <ProtectedRoute role="admin">
              <Interviews />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute role="admin">
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* ADMIN WAITING ROUTE */}
        <Route
          path="/admin/waiting"
          element={
            <ProtectedRoute role="admin">
              <AdminWaiting />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATE WAITING ROUTE */}

        <Route
          path="/candidate/waiting/:roomId"
          element={
            <ProtectedRoute role="candidate">
              <CandidateWaiting />
            </ProtectedRoute>
          }
        />


        {/* CODE EDITOR ROUTE */}
        <Route
          path="/code-editor"
          element={
            <CodeEditor />
          }
        />



        {/* ADMIN INTERVIEW ROUTE */}
        <Route
          path="/admin/interview/:roomId"
          element={
            <ProtectedRoute role="admin">
              <AdminRoom />
            </ProtectedRoute>
          }
        />

        {/* CANDIDATE INTERVIEW ROUTE */}
        <Route
          path="/candidate/interview/:roomId"
          element={
            <ProtectedRoute role="candidate">
              <CandidateRoom />
            </ProtectedRoute>
          }
        />

        {/*Errors*/}
        <Route
          path="/invalid"
          element={
            <Invalid />
          }
        />
        
        <Route
          path="/session-expired"
          element={
            <SessionExpired />
          }
        />
        <Route
          path="/link-expired"
          element={
            <LinkExpired />
          }
        />
        <Route
          path="*"
          element={
            <NotFound/>
          }
        />


        <Route
        path="/candidate/thankyou"
        element={
            <ProtectedRoute role="candidate">
              <ThankYou />
            </ProtectedRoute>
          }
        />
         <Route
        path="/admin/result/:roomId"
        element={
          <ProtectedRoute role="admin">
            <Result />
          </ProtectedRoute>
        }
      />
      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;