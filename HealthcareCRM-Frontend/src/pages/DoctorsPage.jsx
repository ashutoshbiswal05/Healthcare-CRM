import { useEffect, useState } from "react";
import API from "../api/axios";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    phone: ""
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await API.get("/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const addDoctor = async () => {
    try {
      await API.post("/doctors", formData);

      setFormData({
        name: "",
        specialization: "",
        phone: ""
      });

      fetchDoctors();
    } catch (err) {
      console.error("Error adding doctor:", err);
    }
  };

  const handleEdit = (doc) => {
    setFormData({
      name: doc.name,
      specialization: doc.specialization,
      phone: doc.phone
    });

    setEditId(doc.id);
  };

  const updateDoctor = async () => {
    try {
      await API.put(`/doctors/${editId}`, formData);

      setFormData({
        name: "",
        specialization: "",
        phone: ""
      });

      setEditId(null);
      fetchDoctors();
    } catch (err) {
      console.error("Error updating doctor:", err);
    }
  };

  const deleteDoctor = async (id) => {
    try {
      await API.delete(`/doctors/${id}`);
      fetchDoctors();
    } catch (err) {
      console.error("Error deleting doctor:", err);
    }
  };

  const deactivateDoctor = async (id) => {
    try {
      await API.patch(`/doctors/${id}/deactivate`);
      fetchDoctors();
    } catch (err) {
      console.error("Error deactivating doctor:", err);
    }
  };

  const activateDoctor = async (id) => {
    try {
      await API.patch(`/doctors/${id}/activate`);
      fetchDoctors();
    } catch (err) {
      console.error("Error activating doctor:", err);
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = doctors.filter((d) => d.active).length;
  const inactiveCount = doctors.filter((d) => !d.active).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">
          Doctors Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          Manage doctors and account statuses
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Active Doctors</p>
          <h2 className="text-3xl font-bold text-green-600">
            {activeCount}
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-5">
          <p className="text-gray-500">Inactive Doctors</p>
          <h2 className="text-3xl font-bold text-red-600">
            {inactiveCount}
          </h2>
        </div>

      </div>

      {/* FORM */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {editId ? "Edit Doctor" : "Add Doctor"}
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
            name="specialization"
            placeholder="Specialization"
            value={formData.specialization}
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

        </div>

        <button
          onClick={editId ? updateDoctor : addDoctor}
          className="mt-5 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl transition"
        >
          {editId ? "Update Doctor" : "Add Doctor"}
        </button>

      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search doctors..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border bg-white"
        />
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {filteredDoctors.map((d) => (

          <div
            key={d.id}
            className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-4 hover:shadow-md transition"
          >

            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {d.name}
                </h2>

                <p className="text-gray-500">
                  {d.specialization}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  d.active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {d.active ? "Active" : "Inactive"}
              </span>

            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>ID:</strong> {d.id}</p>
              <p><strong>Phone:</strong> {d.phone}</p>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => handleEdit(d)}
                className="px-4 py-2 rounded-lg text-white bg-yellow-500 hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => deleteDoctor(d.id)}
                className="px-4 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800"
              >
                Delete
              </button>

              {d.active ? (
                <button
                  onClick={() => deactivateDoctor(d.id)}
                  className="px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
                >
                  Deactivate
                </button>
              ) : (
                <button
                  onClick={() => activateDoctor(d.id)}
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

export default DoctorsPage;