export default function Navbar() {
  return (
    <div className="bg-white h-16 shadow-sm border-b flex items-center justify-between px-6">

      <h1 className="text-2xl font-bold text-gray-800">
        Dashboard
      </h1>

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          A
        </div>

      </div>

    </div>
  );
}