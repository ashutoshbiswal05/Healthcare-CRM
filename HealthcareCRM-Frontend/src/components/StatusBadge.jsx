export default function StatusBadge({ status }) {
  const colors = {
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    MISSED: "bg-orange-100 text-orange-700",
    BOOKED: "bg-blue-100 text-blue-700",
    RESCHEDULED: "bg-purple-100 text-purple-700",
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status]}`}>
      {status}
    </span>
  )
}