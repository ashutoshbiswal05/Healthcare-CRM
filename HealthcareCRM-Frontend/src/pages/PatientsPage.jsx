import { useEffect, useState } from "react";
import API from "../api/axios";

function PatientsPage() {
  const [patients, setPatients] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    gender: ""
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await API.get("/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addPatient = async () => {
    try {
      await API.post("/patients", formData);

      setFormData({
        name: "",
        phone: "",
        gender: ""
      });

      fetchPatients();
    } catch (err) {
      console.error("Error adding patient:", err);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name,
      phone: patient.phone,
      gender: patient.gender
    });

    setEditId(patient.id);
  };

  const updatePatient = async () => {
    try {
      await API.put(`/patients/${editId}`, formData);

      setFormData({
        name: "",
        phone: "",
        gender: ""
      });

      setEditId(null);
      fetchPatients();
    } catch (err) {
      console.error("Error updating patient:", err);
    }
  };

  const deletePatient = async (id) => {
    try {
      await API.delete(`/patients/${id}`);
      fetchPatients();
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  const deactivatePatient = async (id) => {
    try {
      await API.patch(`/patients/${id}/deactivate`);
      fetchPatients();
    } catch (err) {
      console.error("Error deactivating patient:", err);
    }
  };

  const activatePatient = async (id) => {
    try {
      await API.patch(`/patients/${id}/activate`);
      fetchPatients();
    } catch (err) {
      console.error("Error activating patient:", err);
    }
  };

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = patients.filter((p) => p.active).length;
  const inactiveCount = patients.filter((p) => !p.active).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Patients Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Manage patients and account statuses
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Active Patients</p>
          <h2 className="text-3xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Inactive Patients</p>
          <h2 className="text-3xl font-bold text-red-600">
            {inactiveCount}
          </h2>
        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editId ? "Edit Patient" : "Add Patient"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          />

          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 rounded-xl border bg-gray-50"
          />

        </div>

        <button
          onClick={editId ? updatePatient : addPatient}
          className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition"
        >
          {editId ? "Update Patient" : "Add Patient"}
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border bg-white"
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {filteredPatients.map((p) => (

          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-4 hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {p.name}
                </h2>

                <p className="text-gray-500">
                  {p.gender}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  p.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {p.active ? "Active" : "Inactive"}
              </span>

            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {p.id}</p>
              <p><strong>Phone:</strong> {p.phone}</p>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => handleEdit(p)}
                className="px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => deletePatient(p.id)}
                className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800"
              >
                Delete
              </button>

              {p.active ? (
                <button
                  onClick={() => deactivatePatient(p.id)}
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => activatePatient(p.id)}
                  className="px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600"
                >
                  Activate
                </button>
              )}

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}

export default PatientsPage;