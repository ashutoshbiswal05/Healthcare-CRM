export default function DashboardCard({ title, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 border">
      <p className="text-gray-500 text-sm">{title}</p>

      <h2 className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  )
}