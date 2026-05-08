import StatusBadge from "./StatusBadge"

export default function AppointmentCard({ appointment, onStatusChange }) {
  const locked = appointment.status === "MISSED"

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 flex flex-col gap-4 hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {appointment.patientName}
          </h2>

          <p className="text-gray-500">
            Dr. {appointment.doctorName}
          </p>
        </div>

        <StatusBadge status={appointment.status} />
      </div>

      <div className="text-gray-600 text-sm">
        <p>Date: {appointment.date}</p>
        <p>Time: {appointment.time}</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          disabled={locked}
          onClick={() => onStatusChange(appointment.id, "COMPLETED")}
          className={`px-4 py-2 rounded-lg text-white bg-green-500 hover:bg-green-600 ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Complete
        </button>

        <button
          disabled={locked}
          onClick={() => onStatusChange(appointment.id, "CANCELLED")}
          className={`px-4 py-2 rounded-lg text-white bg-red-500 hover:bg-red-600 ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Cancel
        </button>

        <button
          disabled={locked}
          onClick={() => onStatusChange(appointment.id, "MISSED")}
          className={`px-4 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Missed
        </button>
      </div>
    </div>
  )
}