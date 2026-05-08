import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();

  const linkStyle = (path) =>
    `px-4 py-3 rounded-xl transition ${
      location.pathname === path
        ? "bg-blue-500 text-white"
        : "hover:bg-gray-800 text-gray-300"
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h2 className="text-3xl font-bold mb-10">
        Healthcare CRM
      </h2>

      <div className="flex flex-col gap-3">

        <Link to="/" className={linkStyle("/")}>
          Appointments
        </Link>

        <Link to="/patients" className={linkStyle("/patients")}>
          Patients
        </Link>

        <Link to="/doctors" className={linkStyle("/doctors")}>
          Doctors
        </Link>

      </div>

    </div>
  );
}