import { useEffect, useState } from "react";
import API from "../api/axios";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentTime: ""
  });

  const [editId, setEditId] = useState(null);
  const [isReschedule, setIsReschedule] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const fetchPatients = async () => {
    const res = await API.get("/patients");
    setPatients(res.data);
  };

  const fetchDoctors = async () => {
    const res = await API.get("/doctors");
    setDoctors(res.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatStatus = (status) => {
    if (!status) return "";
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const isMissed = (status) => status === "MISSED";
  const isEditable = (status) => status === "BOOKED" || status === "COMPLETED";
  const canReschedule = (status) => status === "CANCELLED";

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/appointments/${id}/status?status=${status}`);
      fetchAppointments();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const addAppointment = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.appointmentTime) {
      setError("All fields are required!");
      return;
    }

    try {
      const formattedData = {
        ...formData,
        appointmentTime: formData.appointmentTime + ":00",
        status: "Booked",
        notes: null
      };

      await API.post("/appointments", formattedData);

      setError("");
      resetForm();
      fetchAppointments();
    } catch (err) {
      setError("Failed to add appointment");
      console.error(err);
    }
  };

  const handleEdit = (a) => {
    setFormData({
      patientId: a.patientId,
      doctorId: a.doctorId,
      appointmentTime: a.appointmentTime
        ? a.appointmentTime.slice(0, 16)
        : ""
    });

    setEditId(a.id);
    setIsReschedule(false);
  };

  const handleReschedule = (a) => {
    setFormData({
      patientId: a.patientId,
      doctorId: a.doctorId,
      appointmentTime: ""
    });

    setEditId(null);
    setIsReschedule(true);
  };

  const updateAppointment = async () => {
    if (!formData.patientId || !formData.doctorId || !formData.appointmentTime) {
      setError("All fields are required!");
      return;
    }

    try {
      const formattedData = {
        ...formData,
        appointmentTime: formData.appointmentTime + ":00",
        status: "Booked",
        notes: null
      };

      await API.put(`/appointments/${editId}`, formattedData);

      setError("");
      resetForm();
      setEditId(null);
      fetchAppointments();
    } catch (err) {
      setError("Failed to update appointment");
      console.error(err);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      await API.delete(`/appointments/${id}`);
      fetchAppointments();
    } catch (err) {
      console.error("Error deleting appointment:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentTime: ""
    });

    setIsReschedule(false);
  };

  // FILTERS
  const filteredAppointments = appointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(search.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || a.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // COUNTS
  const completedCount = appointments.filter((a) => a.status === "COMPLETED").length;
  const cancelledCount = appointments.filter((a) => a.status === "CANCELLED").length;
  const missedCount = appointments.filter((a) => a.status === "MISSED").length;
  const bookedCount = appointments.filter((a) => a.status === "BOOKED").length;

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "MISSED":
        return "bg-orange-100 text-orange-700";
      case "BOOKED":
        return "bg-blue-100 text-blue-700";
      case "RESCHEDULED":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Appointments Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Manage appointments, statuses and reschedules
        </p>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Completed</p>
          <h2 className="text-3xl font-bold text-green-600">
            {completedCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Cancelled</p>
          <h2 className="text-3xl font-bold text-red-600">
            {cancelledCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Missed</p>
          <h2 className="text-3xl font-bold text-orange-600">
            {missedCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Booked</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {bookedCount}
          </h2>
        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isReschedule
            ? "Reschedule Appointment"
            : editId
            ? "Edit Appointment"
            : "Add Appointment"}
        </h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <select
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          >
            <option value="">Select Patient</option>

            {patients.filter((p) => p.active).map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            name="doctorId"
            value={formData.doctorId}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          >
            <option value="">Select Doctor</option>

            {doctors.filter((d) => d.active).map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          />

        </div>

        <button
          onClick={editId ? updateAppointment : addAppointment}
          className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition"
        >
          {editId ? "Update" : isReschedule ? "Reschedule" : "Add Appointment"}
        </button>

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        <input
          type="text"
          placeholder="Search patient or doctor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 rounded-xl border bg-white"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-3 rounded-xl border bg-white"
        >
          <option value="ALL">All Status</option>
          <option value="BOOKED">Booked</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="MISSED">Missed</option>
        </select>

      </div>

      {/* APPOINTMENT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {filteredAppointments.map((a) => (

          <div
            key={a.id}
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-4 hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {a.patientName}
                </h2>

                <p className="text-gray-500">
                  Dr. {a.doctorName}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(a.status)}`}
              >
                {formatStatus(a.status)}
              </span>

            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {a.id}</p>
              <p><strong>Time:</strong> {a.appointmentTime}</p>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => handleEdit(a)}
                disabled={!isEditable(a.status)}
                className={`px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 ${
                  !isEditable(a.status)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Edit
              </button>

              <button
                onClick={() => updateStatus(a.id, "completed")}
                disabled={a.status !== "BOOKED"}
                className={`px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 ${
                  a.status !== "BOOKED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Complete
              </button>

              <button
                onClick={() => updateStatus(a.id, "cancelled")}
                disabled={a.status !== "BOOKED"}
                className={`px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 ${
                  a.status !== "BOOKED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel
              </button>

              <button
                onClick={() => updateStatus(a.id, "missed")}
                disabled={a.status !== "BOOKED"}
                className={`px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 ${
                  a.status !== "BOOKED"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Missed
              </button>

              <button
                onClick={() => handleReschedule(a)}
                disabled={!canReschedule(a.status)}
                className={`px-4 py-2 rounded-lg text-white bg-purple-500 hover:bg-purple-600 ${
                  !canReschedule(a.status)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Reschedule
              </button>

              <button
                onClick={() => deleteAppointment(a.id)}
                className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default AppointmentsPage;