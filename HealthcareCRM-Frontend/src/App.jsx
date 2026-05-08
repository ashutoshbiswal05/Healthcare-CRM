import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import PatientsPage from "./pages/PatientsPage";
import DoctorsPage from "./pages/DoctorsPage";
import AppointmentsPage from "./pages/AppointmentsPage";

function App() {
  return (
    <BrowserRouter>

      <div className="flex bg-gray-100 min-h-screen">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col">

          {/* NAVBAR */}
          <Navbar />

          {/* PAGE CONTENT */}
          <div className="p-6">

            <Routes>

              <Route
                path="/"
                element={<AppointmentsPage />}
              />

              <Route
                path="/patients"
                element={<PatientsPage />}
              />

              <Route
                path="/doctors"
                element={<DoctorsPage />}
              />

            </Routes>

          </div>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;