import { useState } from "react";
import { ChevronsUpDown, Search } from "lucide-react";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

  const users = ["User1", "User2", "User3", "User4"];

  const filtered = users.filter((user) =>
    user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full mt-2 relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-200/70 rounded-md h-10 cursor-pointer pl-4 pr-10"
      >
        <span
          className={`text-sm ${
            selected ? "text-gray-600 font-medium" : "text-black font-medium"
          }`}
        >
          {selected || "Select profile"}
        </span>
        <ChevronsUpDown className="absolute size-6 right-3 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-50 h-36 overflow-x-hidden bg-white rounded-md shadow-lg border border-gray-300 z-10">
          <div className="flex items-center h-8 w-full border-b border-gray-200 bg-gray-50 gap-x-2 sticky top-0">
            <div className="flex items-center w-5 ml-5">
              <Search className="size-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search user..."
              className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {filtered.map((user) => (
            <div
              key={user}
              onClick={() => {
                setSelected(user);
                setIsOpen(false);
              }}
              className="px-4 py-2 text-sm hover:bg-purple-500/80 rounded-md cursor-pointer"
            >
              {user}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
