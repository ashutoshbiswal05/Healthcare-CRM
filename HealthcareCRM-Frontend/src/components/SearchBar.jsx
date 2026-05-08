export default function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search patient or doctor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
  )
}