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

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* PUBLIC ROUTES */}

        <Route path="/" element={<div>Home</div>} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />


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
          path="/candidate/waiting"
          element={
            <ProtectedRoute role="candidate">
              <CandidateWaiting />
            </ProtectedRoute>
          }
        />
        

      </Routes>

    </BrowserRouter>
  );
}

export default AppRoutes;