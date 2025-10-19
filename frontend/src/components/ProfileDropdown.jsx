import { useState } from 'react';
import { ChevronsUpDown, Plus, Search } from 'lucide-react';
import { useGetAllUsers, useCreateUser } from '../hooks/user.hook';

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newUser, setNewUser] = useState('');

  // const [users, setUsers] = useState(['User1', 'User2', 'User3', 'User4', 'User5', 'User6']);

  const { data, isLoading, isError } = useGetAllUsers();
  const users = data?.data || []; // assuming your ApiResponse structure has { success, data, message }

  // ✅ Mutation for creating user
  const { mutate: createUser, isPending: isCreating } = useCreateUser();

  const filtered = users.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()));

  const handleAddUser = () => {
    if (newUser.trim() !== '') {
      createUser(newUser.trim(), {
        onSuccess: () => {
          setNewUser('');
          setIsAdding(false);
        },
      });
    }
  };

  return (
    <div className="w-full mt-2 relative">
      {/* Dropdown Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center bg-gray-200/70 rounded-md h-10 cursor-pointer pl-4 pr-10 relative"
      >
        <span className={`text-sm ${selected ? 'text-gray-600 font-medium' : 'text-black font-medium'}`}>
          {selected || 'Select profile'}
        </span>
        <ChevronsUpDown className="absolute size-6 right-3 text-gray-400" />
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-gray-300 z-10">
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

          <div className="max-h-32 overflow-y-auto">
            {isLoading ? (
              <div className="text-sm text-gray-500 p-2 text-center">Loading users...</div>
            ) : isError ? (
              <div className="text-sm text-red-500 p-2 text-center">Failed to fetch users</div>
            ) : filtered.length === 0 ? (
              <div className="text-sm text-gray-500 p-2 text-center">No users found</div>
            ) : (
              filtered.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    setSelected(user.name);
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-purple-500/80 hover:text-white cursor-pointer"
                >
                  {user.name}
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-300 bg-gray-50 flex items-center justify-center h-10 p-1">
            {!isAdding ? (
              <button
                className="flex items-center gap-1 text-sm text-black font-semibold"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="size-3" /> Add User
              </button>
            ) : (
              <div className="flex w-full gap-1 px-2">
                <input
                  type="text"
                  placeholder="Enter name"
                  className="w-2/3 text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  value={newUser}
                  onChange={(e) => setNewUser(e.target.value)}
                />
                <button
                  onClick={handleAddUser}
                  disabled={isCreating}
                  className="w-1/3 bg-purple-500 text-white rounded-md text-sm font-medium hover:bg-purple-600 disabled:opacity-60"
                >
                  {isCreating ? 'Adding...' : 'Add'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
